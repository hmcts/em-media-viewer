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
import { PdfAnnotationService } from './pdf-annotation.service';
import { ResponseType, ViewerException } from '../error-message/viewer-exception.model';
import { AnnotationSetService } from './annotation-set.service';
import { CommentSetService } from './comment-set.service';
import { ToolbarButtonVisibilityService } from '../../toolbar/toolbar-button-visibility.service';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  providers: [PdfAnnotationService, AnnotationSetService, CommentSetService],
  encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Output() pdfLoadStatus = new EventEmitter<ResponseType>();
  @Output() pdfViewerException = new EventEmitter<ViewerException>();
  @Output() documentTitle = new EventEmitter<string>();

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
  showCommentsPanel: boolean;

  constructor(
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly annotationService: PdfAnnotationService,
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
    this.annotationService.init(this.pdfWrapper, this.pdfViewer);
    this.pdfWrapper.pageRendered.subscribe((event) => {
      if (this.enableAnnotations) {
        this.annotationService.addAnnotationsAndComments(event);
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
      this.viewerEvents.commentsPanelVisible.subscribe(toggle => this.showCommentsPanel = toggle)
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.pdfWrapper) {
      this.pdfWrapper = this.pdfJsWrapperFactory.create(this.viewerContainer);
    }
    if (changes.url && this.pdfWrapper) {
      this.loadDocument();
    }
    let reloadAnnotations = false;
    if (changes.enableAnnotations && this.pdfWrapper) {
      if (this.enableAnnotations) {
        reloadAnnotations = true;
      } else {
        this.annotationSet = null;
        this.annotationService.destroyComponents();
        this.annotationService.destroyCommentSetsHTML();
      }
    }
    if (changes.annotationSet && this.annotationSet) {
      reloadAnnotations = true;
    }
    if (reloadAnnotations) {
      this.annotationService.buildAnnoSetComponents(this.annotationSet);
      this.annotationService.addCommentsToRenderedPages();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.annotationService.destroyComponents();
  }

  private async loadDocument() {
    await this.pdfWrapper.loadDocument(this.url);
    if (this.enableAnnotations && this.annotationSet) {
      this.annotationService.buildAnnoSetComponents(this.annotationSet);
    }
    this.documentTitle.emit(this.pdfWrapper.getCurrentPDFTitle());
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
    if (this.toolbarEvents.highlightModeSubject.getValue()) {
      this.annotationService.addAnnoSetToPage();
    }
    if (this.toolbarEvents.drawModeSubject.getValue()) {
      this.annotationService.addAnnoSetToPage();
      setTimeout(() => this.viewerEvents.boxSelected({
        page: this.pdfWrapper.getPageNumber(),
        event: mouseEvent
      }), 0);
    }
  }

  onMouseUp(mouseEvent: MouseEvent) {
    if (this.toolbarEvents.highlightModeSubject.getValue()) {
      setTimeout(() => this.viewerEvents.textSelected({
            page: this.pdfWrapper.getPageNumber(), event: mouseEvent
      }), 0);
    }
  }

  toggleCommentsSummary() {
    this.toolbarEvents.toggleCommentsSummary(!this.toolbarEvents.showCommentSummary.getValue());
  }
}
