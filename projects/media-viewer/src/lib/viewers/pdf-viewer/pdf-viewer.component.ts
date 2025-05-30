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
  ViewEncapsulation
} from '@angular/core';
import { asyncScheduler, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, tap, throttleTime } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { DocumentLoadProgress, PageEvent, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { PrintService } from '../../print.service';
import { ResponseType, ViewerException } from '../viewer-exception.model';
import { ToolbarButtonVisibilityService } from '../../toolbar/toolbar-button-visibility.service';
import { CommentSetComponent } from '../../annotations/comment-set/comment-set.component';
import { Outline } from './side-bar/outline-item/outline.model';
import * as fromStore from '../../store/reducers/reducers';
import * as fromDocumentActions from '../../store/actions/document.actions';
import { PdfPositionUpdate } from '../../store/actions/document.actions';
import * as fromTagActions from '../../store/actions/tag.actions';
import { SetCaseId } from '../../store/actions/icp.actions';
import * as fromDocumentsSelector from '../../store/selectors/document.selectors';
import { IcpState } from '../../icp/icp.interfaces';
import { ViewerEventService } from '../viewer-event.service';
import { IcpService } from '../../icp/icp.service';
import { IcpEventService } from '../../toolbar/icp-event.service';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Output() mediaLoadStatus = new EventEmitter<ResponseType>();
  @Output() pdfViewerException = new EventEmitter<ViewerException>();
  @Output() documentTitle = new EventEmitter<string>();

  @Input() downloadUrl: string;
  @Input() url: string;
  @Input() downloadFileName: string;

  @Input() enableAnnotations: boolean;
  @Input() enableRedactions: boolean;
  @Input() enableICP: boolean;
  @Input() annotationSet: AnnotationSet | null;
  @Input() enableRedactSearch: AnnotationSet | null;

  @Input() height: string;
  pageHeights = [];
  rotation = 0;
  zoom = 1;

  @Input() caseId: string;

  highlightMode: Observable<boolean>;
  drawMode: BehaviorSubject<boolean>;

  documentOutline: Outline[];
  loadingDocument = false;
  loadingDocumentProgress: number;
  errorMessage: string;
  hasDifferentPageSize = false;

  @ViewChild('viewerContainer', { static: true }) viewerContainer: ElementRef<HTMLDivElement>;
  @ViewChild('pdfViewer', { static: false }) pdfViewer: ElementRef<HTMLDivElement>;

  private pdfWrapper: PdfJsWrapper;
  private $subscription: Subscription;
  private viewerException: ViewerException;
  showCommentsPanel: boolean;
  showIcpParticipantsList: boolean;
  enableGrabNDrag = false;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private icpStore: Store<IcpState>,
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory,
    private readonly printService: PrintService,
    public readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private icpService: IcpService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    private readonly icpEventService: IcpEventService
  ) {
    this.highlightMode = toolbarEvents.highlightModeSubject.pipe(tap(() => {
      this.store.dispatch(new fromTagActions.ClearFilterTags());
    }));
    this.drawMode = toolbarEvents.drawModeSubject;
  }

  async ngAfterContentInit(): Promise<void> {
    this.pdfWrapper.documentLoadProgress.subscribe(v => this.onDocumentLoadProgress(v));
    this.pdfWrapper.documentLoaded.subscribe(() => this.onDocumentLoaded());
    this.pdfWrapper.documentLoadFailed.subscribe((error) => this.onDocumentLoadFailed(error));
    this.pdfWrapper.outlineLoaded.subscribe(outline => this.documentOutline = outline);
    this.pdfWrapper.pageRendered.subscribe((event) => this.updatePages(event));
    this.$subscription = this.toolbarEvents.printSubject
      .subscribe(() => this.printService.printDocumentNatively(this.url));
    this.$subscription.add(this.toolbarEvents.downloadSubject.subscribe(() =>
      this.pdfWrapper.downloadFile(this.downloadUrl || this.url, this.downloadFileName)
    ));
    this.$subscription.add(this.toolbarEvents.rotateSubject.subscribe(rotate => this.rotateDocument(rotate)));
    this.$subscription.add(this.toolbarEvents.zoomSubject.subscribe(zoom => this.setZoom(zoom)));
    this.$subscription.add(this.toolbarEvents.stepZoomSubject.subscribe(zoom => this.stepZoom(zoom)));
    this.$subscription.add(this.toolbarEvents.searchSubject.subscribe(search => this.pdfWrapper.search(search)));
    this.$subscription.add(
      this.toolbarEvents.setCurrentPageSubject.subscribe(pageNumber => this.pdfWrapper.setPageNumber(pageNumber))
    );
    this.$subscription.add(
      this.toolbarEvents.changePageByDeltaSubject.subscribe(pageNumber => this.pdfWrapper.changePageNumber(pageNumber))
    );
    this.$subscription.add(this.toolbarEvents.grabNDrag.subscribe(grabNDrag => this.enableGrabNDrag = grabNDrag));
    this.$subscription.add(this.toolbarEvents.commentsPanelVisible.subscribe(toggle => {
      this.showCommentsPanel = toggle;
    })
    );
    this.$subscription.add(this.viewerEvents.navigationEvent.subscribe(dest => this.goToDestination(dest)));
    this.$subscription.add(this.viewerEvents.navigationEventICP.subscribe(destination => this.goToDestinationICP(destination)));
    this.$subscription.add(
      this.icpEventService.participantsListVisible.subscribe(toggle => this.showIcpParticipantsList = toggle)
    );
    this.$subscription.add(this.pdfWrapper.positionUpdated.asObservable()
      .pipe(throttleTime(500, asyncScheduler, { leading: true, trailing: true }))
      .subscribe(event => this.store.dispatch(new PdfPositionUpdate(event.location)))
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.pdfWrapper) {
      this.pdfWrapper = this.pdfJsWrapperFactory.create(this.viewerContainer);
    }
    if (changes.url && this.pdfWrapper) {
      await this.loadDocument();
      if (this.enableRedactions) {
        this.toolbarEvents.redactionMode.pipe(filter(value => !!value))
          .subscribe(() => this.resetRotation());
      }
    }
    if (changes.caseId) {
      this.icpStore.dispatch(new SetCaseId(this.caseId));
    }
  }

  resetRotation() {
    if (this.hasDifferentPageSize) {
      this.pdfWrapper.resetRotation(0);
      this.rotation = 0;
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  private async loadDocument() {
    this.initDocumentProgress();
    await this.pdfWrapper.loadDocument(this.url);
    this.documentTitle.emit(this.pdfWrapper.getCurrentPDFTitle());
    this.setPageHeights();
    this.$subscription.add(this.store.pipe(select(fromDocumentsSelector.getPageDifference))
      .subscribe(hasDifferentPageSie => this.hasDifferentPageSize = hasDifferentPageSie));
  }

  private onDocumentLoadProgress(progress: DocumentLoadProgress) {
    if (progress.total) {
      this.loadingDocumentProgress = Math.min(100, Math.ceil(progress.loaded / progress.total * 100));
    }
  }

  private onDocumentLoaded() {
    this.loadingDocument = false;
    this.mediaLoadStatus.emit(ResponseType.SUCCESS);
  }

  private onDocumentLoadFailed(error: Error) {
    this.loadingDocument = false;
    this.viewerException = new ViewerException(error.name, { message: error.message });
    this.errorMessage = `Could not load the document "${this.url}"`;

    this.mediaLoadStatus.emit(ResponseType.FAILURE);
    this.pdfViewerException.emit(this.viewerException);
  }

  private updatePages(event: PageEvent[]) {
    if (this.enableAnnotations) {
      this.store.dispatch(new fromDocumentActions.AddPages(event));
    }
  }

  @Input()
  set searchBarHidden(hidden: boolean) {
    if (this.pdfWrapper && hidden) {
      this.pdfWrapper.clearSearch();
    }
  }

  toggleCommentsSummary() {
    this.toolbarEvents.toggleCommentsSummary(!this.toolbarEvents.showCommentSummary.getValue());
  }

  private rotateDocument(rotation: number) {
    const pageNumber = this.pdfWrapper.getPageNumber();
    this.pdfWrapper.rotate(rotation);
    this.pdfWrapper.setPageNumber(pageNumber);
    this.rotation = (this.rotation + rotation) % 360;
    this.setPageHeights();
  }

  private initDocumentProgress() {
    this.loadingDocument = true;
    this.loadingDocumentProgress = null;
    this.errorMessage = null;
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
      this.zoom = this.calculateZoomValue(this.zoom, zoomFactor);
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
    if (newZoomValue > 5) {
      return 5;
    }
    if (newZoomValue < 0.1) {
      return 0.1;
    }
    return +newZoomValue.toFixed(2);
  }

  private goToDestination(destination: any[]) {
    const currentRotation = this.rotation;
    this.rotateDocument(360 - this.rotation);
    this.pdfWrapper.navigateTo(destination);
    setTimeout(() => {
      this.rotateDocument(currentRotation);
    }, 10);
  }

  private goToDestinationICP(destination: any[]) {
    this.pdfWrapper.nativeNavigate(destination);
  }

  getCurrentPageNumber(): number {
    return this.pdfWrapper.getPageNumber();
  }
}
