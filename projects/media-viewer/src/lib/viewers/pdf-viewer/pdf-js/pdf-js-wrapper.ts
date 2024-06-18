import { Outline } from './../side-bar/outline-item/outline.model';
import { RedactionSearch } from './../../../toolbar/redaction-search-bar/redaction-search.model';
import * as pdfjsLib from 'pdfjs-dist';
import { DownloadManager, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/build/pdf.worker';
import { Subject } from 'rxjs';
import { SearchOperation, SearchResultsCount, ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { PdfPosition } from '../../../store/reducers/document.reducer';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/build/pdf.worker.min.js';

/**
 * Values of the state field returned by the find events
 */
enum FindState {
  FOUND = 0,
  NOT_FOUND = 1,
  WRAPPED = 2,
  PENDING = 3,
}

export class PdfJsWrapper {

  private zoomValue: number;
  private documentTitle: string;
  private documentOutline: Outline[];

  constructor(
    private readonly pdfViewer: PDFViewer,
    private readonly downloadManager: DownloadManager,
    private readonly toolbarEvents: ToolbarEventService,
    public readonly documentLoadInit: Subject<string>,
    public readonly documentLoadProgress: Subject<DocumentLoadProgress>,
    public readonly documentLoaded: Subject<any>,
    public readonly outlineLoaded: Subject<Outline[]>,
    public readonly documentLoadFailed: Subject<Error>,
    public readonly pageRendered: Subject<PageEvent[]>,
    public readonly positionUpdated: Subject<{ location: PdfPosition }>
  ) {
    this.pdfViewer.eventBus.on('updateviewarea', e => positionUpdated.next(e));
    this.pdfViewer.eventBus.on('pagechanging', e => this.toolbarEvents.setCurrentPageInputValueSubject.next(e.pageNumber));
    this.pdfViewer.eventBus.on('pagesinit', () => this.pdfViewer.currentScaleValue = '1');

    this.pdfViewer.eventBus.on('pagerendered', e => { }); // not used left for future convenience
    this.pdfViewer.eventBus.on('pagesloaded', (e) => this.emitDocumentInfo(e));
    this.pdfViewer.eventBus.on('scalechanging', (e) => this.emitDocumentInfo(e));
    this.pdfViewer.eventBus.on('rotationchanging', (e) => this.emitDocumentInfo(e));

    this.pdfViewer.eventBus.on('updatefindcontrolstate', event => {
      this.sendSearchDetails(event);
    });
    this.pdfViewer.eventBus.on('updatefindmatchescount', event => {
      const result = { ...event.matchesCount, isPrevious: event?.source?.state?.findPrevious } as SearchResultsCount
      this.toolbarEvents.searchResultsCountSubject.next(result);
    });
    this.zoomValue = 1;
  }

  sendSearchDetails(event: any) {
    if (event.state !== FindState.PENDING) {
      const result = { ...event.matchesCount, isPrevious: event?.source?.state?.findPrevious } as SearchResultsCount
      this.toolbarEvents.searchResultsCountSubject.next(result);
      if (event?.source?.selected?.pageIdx !== -1 && event.matchesCount.total > 0) {
        this.toolbarEvents.redactionSerachSubject.next({
          page: event?.source?.selected?.pageIdx,
          matchedIndex: event?.source?.selected?.matchIdx,
          matchesCount: event.matchesCount.total
        } as RedactionSearch
        );
      }
    }
  }

  private emitDocumentInfo(e) {
    const allPages: PageEvent[] = [...this.pdfViewer._pages].map(page => {
      return {
        div: page.div,
        scale: page.scale,
        rotation: page.rotation,
        id: page.id,
        viewportScale: page.viewport.scale
      };
    });
    this.pageRendered.next(allPages);
  }

  public async loadDocument(documentUrl: string) {
    const loadingTask = this.createLoadingTask(documentUrl);

    loadingTask.onProgress = ({ loaded, total }) => {
      this.documentLoadProgress.next({ loaded, total });
    };

    this.documentLoadInit.next(documentUrl);

    try {
      const pdfDocument = await loadingTask.promise;
      this.documentLoaded.next(pdfDocument);
      this.toolbarEvents.pageCountSubject.next(pdfDocument.numPages);

      this.pdfViewer.setDocument(pdfDocument);
      this.pdfViewer.linkService.setDocument(pdfDocument, null);

      const outlineNode = await pdfDocument.getOutline();
      const outline = outlineNode ? outlineNode.map(x => {
        return {
          bold: x.bold,
          color: x.color,
          count: x.count,
          dest: x.dest,
          italic: x.italic,
          items: x.items,
          newWindow: x.newWindow,
          title: x.title,
          unsafeUrl: x.unsafeUrl,
          url: x.url
        } as Outline
      }) : null;



      if (outline) {
        await this.setOutlinePageNumbers(pdfDocument, outline);
      }

      this.documentOutline = outline;
      this.outlineLoaded.next(this.documentOutline);
      const pdfMetaData = await pdfDocument.getMetadata();
      this.setCurrentPDFTitle((pdfMetaData.info as any)?.Title);
    } catch (e) {
      this.documentLoadFailed.next(e);
    }
  }

  private createLoadingTask(documentUrl: string) {
    return pdfjsLib.getDocument({
      url: documentUrl,
      cMapUrl: 'assets/minified/cmaps',
      cMapPacked: true,
      withCredentials: true,
      isEvalSupported: false
    });
  }

  private async setOutlinePageNumbers(pdfDocument, outlineArray: Outline[]) {
    outlineArray.forEach(async (outline: Outline) => {
      await this.setNestedOutlinePageNumbers(pdfDocument, outline);
    });
  }

  private async setNestedOutlinePageNumbers(pdfDocument, outline: Outline) {
    outline.pageNumber = await this.getOutlinePageNumber(pdfDocument, outline);
    outline.items.forEach(async (outlineItem: Outline) => {
      outlineItem.pageNumber = await this.getOutlinePageNumber(pdfDocument, outlineItem);
      this.setNestedOutlinePageNumbers(pdfDocument, outlineItem);
    });
  }

  private async getOutlinePageNumber(pdfDocument, outline: Outline): Promise<number> {
    const dest = outline.dest;
    const pageIndex = await pdfDocument.getPageIndex(dest[0]);
    return Number(pageIndex) + 1;
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

  public navigateTo(destination: object) {
    if (destination instanceof Object) {
      if (!destination[1].name.includes('XYZ')) {
        destination[1] = { name: 'XYZ' };
        destination[2] = destination[2] || null;
        destination[3] = destination[3] || null;
      }
      destination[4] = this.zoomValue;
    }
    this.nativeNavigate(destination);
  }

  public nativeNavigate(destination: object) {
    this.pdfViewer.linkService.navigateTo(destination);
  }

  public setZoom(zoomValue: number): void {
    this.pdfViewer.currentScaleValue = this.getZoomValue(zoomValue);
    this.zoomValue = this.pdfViewer.currentScaleValue;
    this.toolbarEvents.zoomValueSubject.next(this.pdfViewer.currentScaleValue);
  }

  public stepZoom(zoomValue: number): void {
    this.pdfViewer.currentScaleValue = +this.getZoomValue((+this.pdfViewer.currentScaleValue) + zoomValue);
    this.zoomValue = this.pdfViewer.currentScaleValue;
    this.toolbarEvents.zoomValueSubject.next(this.pdfViewer.currentScaleValue);
  }

  private getZoomValue(zoomValue: number): number {
    if (isNaN(zoomValue)) { return this.zoomValue; }
    if (zoomValue > 5) { return 5; }
    if (zoomValue < 0.1) { return 0.1; }

    return +zoomValue.toFixed(2);
  }

  public rotate(rotation: number): number {
    return this.pdfViewer.pagesRotation = (this.pdfViewer.pagesRotation + rotation) % 360;
  }

  public resetRotation(rotation: number): number {
    return this.pdfViewer.pagesRotation = rotation;
  }

  public getNormalisedPagesRotation(): number {
    return this.pdfViewer.pagesRotation;
  }

  public getCurrentPDFZoomValue(): number {
    return this.pdfViewer.currentScaleValue;
  }

  public setCurrentPDFTitle(title: string) {
    this.documentTitle = title;
  }

  public getCurrentPDFTitle(): string {
    return this.documentTitle;
  }
}

export interface DocumentLoadProgress {
  loaded: number;
  total: number;
}

export interface PageEvent {
  div: object;
  scale: number;
  rotation: number;
  id: string;
  viewportScale: number;
}
