import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { Subject } from 'rxjs';
import { PrintService } from '../../service/print.service';
import {
  ChangePageByDeltaOperation, DocumentLoadFailed, DocumentLoadProgress,
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  SearchOperation,
  SearchResultsCount,
  SetCurrentPageOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../model/viewer-operations';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit, OnChanges {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() searchResults: Subject<SearchResultsCount>;
  @Input() zoomValue: Subject<ZoomValue>;
  @Input() currentPageChanged: Subject<SetCurrentPageOperation>;

  loadingDocument = false;
  loadingDocumentProgress: number;

  @ViewChild('viewerContainer') viewerContainer: ElementRef;

  private pdfWrapper: PdfJsWrapper;

  constructor(
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory,
    private readonly printService: PrintService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.pdfWrapper = this.pdfJsWrapperFactory.create(this.viewerContainer);
    this.pdfWrapper.currentPageChanged.subscribe(v => this.currentPageChanged.next(v));
    this.pdfWrapper.searchResults.subscribe(v => this.searchResults.next(v));
    this.pdfWrapper.documentLoadInit.subscribe(() => this.onDocumentLoadInit());
    this.pdfWrapper.documentLoadProgress.subscribe(v => this.onDocumentLoadProgress(v));
    this.pdfWrapper.documentLoaded.subscribe(() => this.onDocumentLoaded());
    this.pdfWrapper.documentLoadFailed.subscribe(() => this.onDocumentLoadFailed());
    this.pdfWrapper.searchResults.subscribe(v => this.searchResults.next(v));

    await this.pdfWrapper.loadDocument(this.url);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.url && this.pdfWrapper) {
      await this.pdfWrapper.loadDocument(this.url);
    }
  }

  private onDocumentLoadInit() {
    this.loadingDocument = true;
    this.loadingDocumentProgress = null;
  }

  private onDocumentLoadProgress(documentLoadProgress: DocumentLoadProgress) {
    if (documentLoadProgress.total) {
      this.loadingDocumentProgress = Math.max(100, Math.ceil(documentLoadProgress.loaded / documentLoadProgress.total * 100 ));
    }
  }

  private onDocumentLoaded() {
    this.loadingDocument = false;
  }

  private onDocumentLoadFailed() {
    this.loadingDocument = false;
  }

  @Input()
  set rotateOperation(operation: RotateOperation | null) {
    if (operation) {
      this.pdfWrapper.rotate(operation.rotation);
    }
  }

  @Input()
  set zoomOperation(operation: ZoomOperation | null) {
    if (operation) {
      this.zoomValue.next({
        value: this.pdfWrapper.setZoom(operation.zoomFactor)
      });
    }
  }

  @Input()
  set stepZoomOperation(operation: StepZoomOperation | null) {
    if (operation) {
      this.zoomValue.next({
        value: this.pdfWrapper.stepZoom(Math.round(operation.zoomFactor * 10) / 10)
      });
    }
  }

  @Input()
  set searchOperation(operation: SearchOperation | null) {
    if (operation) {
      this.pdfWrapper.search(operation);
    }
  }

  @Input()
  set printOperation(operation: PrintOperation | null) {
    if (operation) {
      this.printService.printDocumentNatively(this.url);
    }
  }

  @Input()
  set downloadOperation(operation: DownloadOperation | null) {
    if (operation) {
      this.pdfWrapper.downloadFile(this.url, this.downloadFileName);
    }
  }

  @Input()
  set setCurrentPage(operation: SetCurrentPageOperation | null) {
    if (operation) {
      this.pdfWrapper.setPageNumber(operation.pageNumber);
    }
  }

  @Input()
  set changePageByDelta(operation: ChangePageByDeltaOperation | null) {
    if (operation) {
      this.pdfWrapper.changePageNumber(operation.delta);
    }
  }

  @Input()
  set searchBarHidden(hidden: boolean) {
    if (this.pdfWrapper && hidden) {
      this.pdfWrapper.clearSearch();
    }
  }


}
