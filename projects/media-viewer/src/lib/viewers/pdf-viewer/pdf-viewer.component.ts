import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { DocumentLoadProgress, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { PrintService } from '../../print.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ViewerEventService } from '../viewer-event.service';
import { PdfAnnotationService } from './pdf-annotation-service';
import { ResponseType, ViewerException } from '../error-message/viewer-exception.model';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  providers: [PdfAnnotationService],
  encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Output() pdfLoadStatus = new EventEmitter<ResponseType>();
  @Output() pdfViewerException = new EventEmitter<ViewerException>();
  @Output() unsavedChanges = new EventEmitter<boolean>();

  @Input() url: string;
  @Input() downloadFileName: string;

  @Input() enableAnnotations: boolean;
  @Input() annotationSet: AnnotationSet | null;

  @Input() height: string;

  highlightMode: BehaviorSubject<boolean>;
  drawMode: BehaviorSubject<boolean>;

  loadingDocument = false;
  loadingDocumentProgress: number;
  errorMessage: string;

  @ViewChild('viewerContainer') viewerContainer: ElementRef<HTMLDivElement>;
  @ViewChild('pdfViewer') pdfViewer: ElementRef<HTMLDivElement>;

  private pdfWrapper: PdfJsWrapper;
  private subscriptions: Subscription[] = [];
  private viewerException: ViewerException;
  showCommentsPanel = true;

  constructor(
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly annotationService: PdfAnnotationService
  ) {
    this.highlightMode = toolbarEvents.highlightModeSubject;
    this.drawMode = toolbarEvents.drawModeSubject;
  }

  async ngAfterContentInit(): Promise<void> {
    this.pdfWrapper = this.pdfJsWrapperFactory.create(this.viewerContainer);
    this.pdfWrapper.documentLoadInit.subscribe(() => this.onDocumentLoadInit());
    this.pdfWrapper.documentLoadProgress.subscribe(v => this.onDocumentLoadProgress(v));
    this.pdfWrapper.documentLoaded.subscribe(() => this.onDocumentLoaded());
    this.pdfWrapper.documentLoadFailed.subscribe((error) => this.onDocumentLoadFailed(error));
    this.annotationService.init(this.pdfWrapper, this.pdfViewer);
    this.pdfWrapper.pageRendered.subscribe((event) => {
      if (this.enableAnnotations) {
        this.annotationService.onPageRendered(event);
        this.annotationService.unsavedChangesSubject.subscribe(changes => this.onCommentChange(changes));
      }
    });

    this.subscriptions.push(
      this.toolbarEvents.printSubject.subscribe(() => this.printService.printDocumentNatively(this.url)),
      this.toolbarEvents.downloadSubject.subscribe(() => this.pdfWrapper.downloadFile(this.url, this.downloadFileName)),
      this.toolbarEvents.rotateSubject.subscribe(rotation => {
        const pageNumber = this.pdfWrapper.getPageNumber();
        this.pdfWrapper.rotate(rotation);
        this.pdfWrapper.setPageNumber(pageNumber);
      }),
      this.toolbarEvents.zoomSubject.subscribe(zoom => this.pdfWrapper.setZoom(zoom)),
      this.toolbarEvents.stepZoomSubject.subscribe(zoom => this.pdfWrapper.stepZoom(zoom)),
      this.toolbarEvents.searchSubject.subscribe(search => this.pdfWrapper.search(search)),
      this.toolbarEvents.setCurrentPageSubject.subscribe(pageNumber => this.pdfWrapper.setPageNumber(pageNumber)),
      this.toolbarEvents.changePageByDeltaSubject.subscribe(pageNumber => this.pdfWrapper.changePageNumber(pageNumber)),
      this.viewerEvents.commentsPanelToggle.subscribe(toggle => this.showCommentsPanel = toggle)
    );
    await this.loadDocument();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.url && this.pdfWrapper) {
      await this.loadDocument();
    }
    if (changes.enableAnnotations && this.pdfWrapper) {
      if (!this.enableAnnotations) {
        this.annotationService.destroyComponents();
        this.annotationSet = null;
      }
      this.loadDocument();
    }
    if (changes.annotationSet && this.annotationSet) {
      console.log('annoationSet changing', this.annotationSet);
      this.loadDocument();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.annotationService.destroyComponents();
  }

  private async loadDocument() {
    await this.pdfWrapper.loadDocument(this.url);
    if (this.enableAnnotations && this.annotationSet) {
      this.annotationService.setupAnnotationSet(this.annotationSet);
    }
  }

  private onDocumentLoadInit() {
    this.loadingDocument = true;
    this.loadingDocumentProgress = null;
    this.errorMessage = null;
  }

  private onDocumentLoadProgress(documentLoadProgress: DocumentLoadProgress) {
    if (documentLoadProgress.total) {
      this.loadingDocumentProgress = Math.min(100, Math.ceil(documentLoadProgress.loaded / documentLoadProgress.total * 100 ));
    }
  }

  private onDocumentLoaded() {
    this.loadingDocument = false;
    this.pdfLoadStatus.emit(ResponseType.SUCCESS);
  }

  private onDocumentLoadFailed(error: Error) {
    this.loadingDocument = false;
    this.viewerException = new ViewerException(error.name, {message: error.message});
    this.errorMessage = `Could not load the document "${this.url}"`;

    this.pdfLoadStatus.emit(ResponseType.FAILURE);
    this.pdfViewerException.emit(this.viewerException);
  }

  @Input()
  set searchBarHidden(hidden: boolean) {
    if (this.pdfWrapper && hidden) {
      this.pdfWrapper.clearSearch();
    }
  }

  onMouseDown(mouseEvent: MouseEvent) {
    this.annotationService.onShapeHighlighted(mouseEvent);
  }

  onMouseUp(mouseEvent: MouseEvent) {
    this.annotationService.onTextHighlighted(mouseEvent);
  }

  onCommentChange(change: boolean) {
    this.unsavedChanges.emit(change);
  }
}
