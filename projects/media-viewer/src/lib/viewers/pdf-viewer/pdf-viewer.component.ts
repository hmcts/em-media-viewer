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
import { ResponseType, ViewerException } from '../error-message/viewer-exception.model';
import { ToolbarButtonVisibilityService } from '../../toolbar/toolbar-button-visibility.service';
import { CommentSetComponent } from '../../annotations/comment-set/comment-set.component';
import { Outline } from './outline-view/outline.model';
import {Store} from '@ngrx/store';
import * as fromStore from '../../store/reducers';
import * as fromActions from '../../store/actions/annotations.action';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Output() pdfLoadStatus = new EventEmitter<ResponseType>();
  @Output() pdfViewerException = new EventEmitter<ViewerException>();
  @Output() documentTitle = new EventEmitter<string>();

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() page: number;

  @Input() enableAnnotations: boolean;
  @Input() annotationSet: AnnotationSet | null;

  @Input() height: string;
  pageHeights = [];
  rotation = 0;
  zoom = 1;

  highlightMode: BehaviorSubject<boolean>;
  drawMode: BehaviorSubject<boolean>;

  documentOutline: Outline;
  loadingDocument = false;
  loadingDocumentProgress: number;
  errorMessage: string;

  @ViewChild('viewerContainer') viewerContainer: ElementRef<HTMLDivElement>;
  @ViewChild('pdfViewer') pdfViewer: ElementRef<HTMLDivElement>;
  @ViewChild('commentPanel') commentPanel: CommentSetComponent;

  private pdfWrapper: PdfJsWrapper;
  private subscriptions: Subscription[] = [];
  private viewerException: ViewerException;
  showCommentsPanel: boolean;
  enableGrabNDrag = false;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly printService: PrintService,
    public readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
  ) {
    this.highlightMode = toolbarEvents.highlightModeSubject;
    this.drawMode = toolbarEvents.drawModeSubject;
  }

  async ngAfterContentInit(): Promise<void> {
    this.pdfWrapper.documentLoadInit.subscribe(() => this.onDocumentLoadInit());
    this.pdfWrapper.documentLoadProgress.subscribe(v => this.onDocumentLoadProgress(v));
    this.pdfWrapper.documentLoaded.subscribe(() => this.onDocumentLoaded());
    this.pdfWrapper.documentLoadFailed.subscribe((error) => this.onDocumentLoadFailed(error));
    this.pdfWrapper.outlineLoaded.subscribe(outline => this.documentOutline = outline);
    this.pdfWrapper.pageRendered.subscribe((event) => {
      if (this.enableAnnotations) {
        const payload: any  = {
          div: event.source.div,
          pageNumber: event.pageNumber,
          scale: event.source.scale,
          rotation: event.source.rotation
        };
        this.store.dispatch(new fromActions.AddPage(payload));
      }
    });
    this.subscriptions.push(
      this.toolbarEvents.printSubject.subscribe(() => this.printService.printDocumentNatively(this.url)),
      this.toolbarEvents.downloadSubject.subscribe(() => this.pdfWrapper.downloadFile(this.url, this.downloadFileName)),
      this.toolbarEvents.rotateSubject.subscribe(rotation => this.setRotation(rotation)),
      this.toolbarEvents.zoomSubject.subscribe(zoom => this.setZoom(zoom)),
      this.toolbarEvents.stepZoomSubject.subscribe(zoom => this.stepZoom(zoom)),
      this.toolbarEvents.searchSubject.subscribe(search => this.pdfWrapper.search(search)),
      this.toolbarEvents.setCurrentPageSubject.subscribe(pageNumber => this.pdfWrapper.setPageNumber(pageNumber)),
      this.toolbarEvents.changePageByDeltaSubject.subscribe(pageNumber => this.pdfWrapper.changePageNumber(pageNumber)),
      this.toolbarEvents.grabNDrag.subscribe(grabNDrag => this.enableGrabNDrag = grabNDrag),
      this.viewerEvents.commentsPanelVisible.subscribe(toggle => this.showCommentsPanel = toggle)
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.pdfWrapper) {
      this.pdfWrapper = this.pdfJsWrapperFactory.create(this.viewerContainer);
    }
    if (changes.url && this.pdfWrapper) {
      this.loadDocument();
      this.clearAnnotationSet();
    }

    if (changes.page && this.pdfWrapper) {
      this.pdfWrapper.setPageNumber(this.page);
    }
  }

  clearAnnotationSet() {
    this.annotationSet = null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  private async loadDocument() {
    await this.pdfWrapper.loadDocument(this.url);
    this.documentTitle.emit(this.pdfWrapper.getCurrentPDFTitle());
    this.setPageHeights();
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

  onPdfViewerClick() {
    this.store.dispatch(new fromActions.SelectedAnnotation({annotationId: '', selected: false, editable: false}));
  }

  onMouseUp(mouseEvent: MouseEvent) {
    if (this.toolbarEvents.highlightModeSubject.getValue()) {
      this.viewerEvents.textSelected({
        page: this.pdfWrapper.getPageNumber(),
        event: mouseEvent,
        annoSet: this.annotationSet
      });
    }
    if (!this.annotationSet) {
      if (this.toolbarEvents.highlightModeSubject.getValue()) {
        this.toolbarEvents.highlightModeSubject.next(false);
      }
      if (this.toolbarEvents.drawModeSubject.getValue()) {
        this.toolbarEvents.drawModeSubject.next(false);
      }
    }
  }

  toggleCommentsSummary() {
    this.toolbarEvents.toggleCommentsSummary(!this.toolbarEvents.showCommentSummary.getValue());
  }

  private setRotation(rotation: number) {
    const pageNumber = this.pdfWrapper.getPageNumber();
    this.commentPanel.container.nativeElement.style.height = 0;
    this.pdfWrapper.rotate(rotation);
    this.pdfWrapper.setPageNumber(pageNumber);
    this.rotation = (this.rotation + rotation) % 360;
    this.setPageHeights();
  }

  private setZoom(zoomFactor: number) {
    if (!isNaN(zoomFactor)) {
      this.pdfWrapper.setZoom(zoomFactor);
      this.zoom = this.calculateZoomValue(zoomFactor);
      this.setPageHeights();
    }
  }

  private stepZoom(zoomFactor: number) {
    if (!isNaN(zoomFactor)) {
      this.pdfWrapper.stepZoom(zoomFactor);
      this.zoom = Math.round(this.calculateZoomValue(this.zoom, zoomFactor) * 10) / 10;
      this.setPageHeights();
    }
  }

  setPageHeights() {
    this.pageHeights = [];
    const pdfViewerChildren = this.pdfViewer.nativeElement.children;
    for (let i = 0; i < pdfViewerChildren.length; i++) {
      this.pageHeights.push(pdfViewerChildren[i].clientHeight);
    }
  }

  calculateZoomValue(zoomValue, increment = 0) {
    const newZoomValue = zoomValue + increment;
    if (newZoomValue > 5) { return 5; }
    if (newZoomValue < 0.1) { return 0.1; }
    return newZoomValue;
  }

  goToOutlineDest(destination: any) {
    this.pdfWrapper.navigateTo(destination);
  }
}
