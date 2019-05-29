import * as pdfjsLib from 'pdfjs-dist';
import { PDFViewer, DownloadManager } from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/build/pdf.worker';
import { SearchOperation, SearchResultsCount, SetCurrentPageOperation } from '../../../model/viewer-operations';
import { Subject } from 'rxjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/build/pdf.worker.min.js';

export class PdfJsWrapper {

  constructor(
    public readonly searchResults: Subject<SearchResultsCount>,
    public readonly currentPageChanged: Subject<SetCurrentPageOperation>,
    private readonly pdfViewer: PDFViewer,
    private readonly downloadManager: DownloadManager,
  ) {

    // bind to internal PDF.js event bus
    this.pdfViewer.eventBus.on('pagechanging', e => this.currentPageChanged.next(new SetCurrentPageOperation(e.pageNumber)));
    this.pdfViewer.eventBus.on('pagesinit', () => this.pdfViewer.currentScaleValue = '1');
    this.pdfViewer.eventBus.on('updatefindcontrolstate', e => {
      if (e.state !== FindState.PENDING) {
        this.searchResults.next(e.matchesCount);
      }
    });
    this.pdfViewer.eventBus.on('updatefindmatchescount', e => {
      this.searchResults.next(e.matchesCount);
    });
  }

  public async loadDocument(documentUrl: string): Promise<void> {
    const pdfDocument = await pdfjsLib.getDocument({
      url: documentUrl,
      cMapUrl: 'assets/minified/cmaps',
      cMapPacked: true,
    });

    this.pdfViewer.setDocument(pdfDocument);
    this.pdfViewer.linkService.setDocument(pdfDocument, null);
  }

  public downloadFile(url: string, filename: string): void {
    this.downloadManager.downloadUrl(url, filename);
  }

  public setPageNumber(pageNumber: number): void {
    this.pdfViewer.currentPageNumber = pageNumber;
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

  public setZoom(zoomValue: number): number {
    return this.pdfViewer.currentScaleValue = this.getZoomValue(zoomValue);
  }

  public stepZoom(zoomValue: number): number {
    return this.pdfViewer.currentScaleValue  = Math.round(this.getZoomValue((+this.pdfViewer.currentScaleValue) + zoomValue) * 10) / 10;
  }

  private getZoomValue(zoomValue: number): number {
    if (isNaN(zoomValue)) { return zoomValue; }
    if (zoomValue > 5) { return 5; }
    if (zoomValue < 0.1) { return 0.1; }

    return zoomValue;
  }

  public rotate(rotation: number): number {
    return this.pdfViewer.pagesRotation = (this.pdfViewer.pagesRotation + rotation) % 360;
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
