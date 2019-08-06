import * as pdfjsLib from 'pdfjs-dist';
import { DownloadManager, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/build/pdf.worker';
import { Subject } from 'rxjs';
import { SearchOperation, ToolbarEventService } from '../../../toolbar/toolbar-event.service';

pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/build/pdf.worker.min.js';

export class PdfJsWrapper {

  constructor(
    private readonly pdfViewer: PDFViewer,
    private readonly downloadManager: DownloadManager,
    private readonly toolbarEvents: ToolbarEventService,
    public readonly documentLoadInit: Subject<string>,
    public readonly documentLoadProgress: Subject<DocumentLoadProgress>,
    public readonly documentLoaded: Subject<any>,
    public readonly documentLoadFailed: Subject<undefined>,
    public readonly pageRendered: Subject<PageEvent>
  ) {

    // bind to internal PDF.js event bus
    this.pdfViewer.eventBus.on('pagerendered', e => this.pageRendered.next(e));
    this.pdfViewer.eventBus.on('pagechanging', e => this.toolbarEvents.setCurrentPage.next(e.pageNumber));
    this.pdfViewer.eventBus.on('pagesinit', () => this.pdfViewer.currentScaleValue = '1');
    this.pdfViewer.eventBus.on('updatefindcontrolstate', event => {
      if (event.state !== FindState.PENDING) {
        this.toolbarEvents.searchResultsCount.next(event.matchesCount);
      }
    });
    this.pdfViewer.eventBus.on('updatefindmatchescount', event => {
      this.toolbarEvents.searchResultsCount.next(event.matchesCount);
    });
  }

  public async loadDocument(documentUrl: string) {
    const loadingTask = pdfjsLib.getDocument({
      url: documentUrl,
      cMapUrl: 'assets/minified/cmaps',
      cMapPacked: true,
      withCredentials: true
    });

    loadingTask.onProgress = ({loaded, total}) => {
      this.documentLoadProgress.next({ loaded, total });
    };

    this.documentLoadInit.next(documentUrl);

    try {
      const pdfDocument = await loadingTask;

      this.documentLoaded.next(pdfDocument);

      this.pdfViewer.setDocument(pdfDocument);
      this.pdfViewer.linkService.setDocument(pdfDocument, null);

    } catch (e) {
      this.documentLoadFailed.next();
    }

  }

  public downloadFile(url: string, filename: string): void {
    this.downloadManager.downloadUrl(url, filename);
  }

  public setPageNumber(pageNumber: number): void {
    this.pdfViewer.currentPageNumber = pageNumber;
  }
  public getPageNumber(): number {
    return this.pdfViewer.currentPageNumber;
  }
  public changePageNumber(numPages: number): void {
    this.pdfViewer.currentPageNumber += numPages;
  }

  public search(operation: SearchOperation): void {
    const command = operation.reset ? 'find' : 'findagain';

    this.pdfViewer.findController.executeCommand(command, {
      query: operation.searchTerm,
      phraseSearch: true,
      caseSensitive: operation.matchCase,
      entireWord: operation.wholeWord,
      highlightAll: operation.highlightAll,
      findPrevious: operation.previous,
    });
  }

  public clearSearch(): void {
    this.pdfViewer.eventBus.dispatch('findbarclose');
  }

  public setZoom(zoomValue: number): void {
    this.pdfViewer.currentScaleValue = this.getZoomValue(zoomValue);
    this.toolbarEvents.zoomValue.next(this.pdfViewer.currentScaleValue);
  }

  public stepZoom(zoomValue: number): void {
    this.pdfViewer.currentScaleValue = Math.round(this.getZoomValue((+this.pdfViewer.currentScaleValue) + zoomValue) * 10) / 10;
    this.toolbarEvents.zoomValue.next(this.pdfViewer.currentScaleValue);
  }

  private getZoomValue(zoomValue: number): number {
    if (isNaN(zoomValue)) { return zoomValue; }
    if (zoomValue > 5) { return 5; }
    if (zoomValue < 0.1) { return 0.1; }

    return zoomValue;
  }

  public rotate(rotation: number): number {
    return this.pdfViewer.pagesRotation = (this.pdfViewer.pagesRotation + rotation) %360;
  }

  public getNormalisedPagesRotation(): number {
    return this.pdfViewer.pagesRotation;
  }

  public getCurrentPDFZoomValue(): number {
    return this.pdfViewer.currentScaleValue;
  }
}

/**
 * Values of the state field returned by the find events
 */
enum FindState {
  FOUND = 0,
  NOT_FOUND = 1,
  WRAPPED = 2,
  PENDING = 3,
}

export interface DocumentLoadProgress {
  loaded: number;
  total: number;
}

export interface PageEvent {
  pageNumber: number;
  source: {
    rotation: number,
    scale: number,
    div: HTMLElement
  };
}

