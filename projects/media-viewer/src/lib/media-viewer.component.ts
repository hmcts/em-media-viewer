import {
  AfterContentInit, AfterViewChecked,
  ChangeDetectorRef,
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
import { Observable, Subscription } from 'rxjs';
import {
  defaultImageOptions, defaultMultimediaOptions,
  defaultPdfOptions,
  defaultUnsupportedOptions,
  ToolbarButtonVisibilityService
} from './toolbar/toolbar-button-visibility.service';
import { AnnotationSet } from './annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from './toolbar/toolbar-event.service';
import { AnnotationApiService } from './annotations/services/annotation-api/annotation-api.service';
import { ResponseType, ViewerException } from './viewers/viewer-exception.model';
import { CommentService } from './annotations/comment-set/comment/comment.service';
import 'hammerjs';
import { select, Store } from '@ngrx/store';
import * as fromStore from './store/reducers/reducers';
import * as fromAnnoSelectors from './store/selectors/annotation.selectors';
import * as fromDocumentsSelector from './store/selectors/document.selectors';
import * as fromAnnoActions from './store/actions/annotation.actions';
import * as fromRedactActions from './store/actions/redaction.actions';
import * as fromDocumentActions from './store/actions/document.actions';

enum CoreContentTypes {
  PDF = 'pdf',
  IMAGE = 'image'
}

enum MultimediaContentTypes {
  MP4 = 'mp4',
  MP3 = 'mp3',
}

enum ConvertibleContentTypes {
  EXCEL = 'excel',
  WORD = 'word',
  POWERPOINT = 'powerpoint',
  TXT = 'txt',
  RTF = 'rtf'
}

@Component({
  selector: 'mv-media-viewer',
  templateUrl: './media-viewer.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MediaViewerComponent implements OnChanges, OnDestroy, AfterContentInit, AfterViewChecked {

  @ViewChild('viewerRef', {static: false}) viewerRef: ElementRef;

  @Input() url;
  @Input() downloadFileName: string;
  @Input() contentType: string;

  @Input() showToolbar = true;
  @Input() toolbarButtonOverrides: any = {};

  @Input()
  public height: string;
  public viewerHeight: string;

  @Input() width = '100%';

  @Output() mediaLoadStatus = new EventEmitter<ResponseType>();
  @Output() viewerException = new EventEmitter<ViewerException>();
  @Output() toolbarEventsOutput = new EventEmitter<ToolbarEventService>();
  @Output() unsavedChanges = new EventEmitter<boolean>();

  @Input() enableAnnotations = false;
  @Input() annotationApiUrl;

  @Input() enableRedactions = false;
  @Input() enableICP = false;
  @Input() multimediaPlayerEnabled = false;


  @Input() caseId: string;

  multimediaContent = false;
  convertibleContent = false;
  unsupportedContent = false;

  documentTitle: string;
  showCommentSummary: boolean;
  annotationSet$: Observable<AnnotationSet | {}>;
  hasScrollBar: boolean;
  typeException = false;
  hasDifferentPageSize$: Observable<boolean>;
  documentId: string;

  private $subscriptions: Subscription;
  private prevOffset: number;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService,
    private readonly api: AnnotationApiService,
    private readonly commentService: CommentService,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    if (this.annotationApiUrl) {
      api.annotationApiUrl = this.annotationApiUrl;
    }
  }

  ngAfterContentInit() {
    this.annotationSet$ = this.store.pipe(select(fromAnnoSelectors.getAnnotationSet));
    this.hasDifferentPageSize$ = this.store.pipe(select(fromDocumentsSelector.getPageDifference));
    this.setToolbarButtons();
    this.toolbarEventsOutput.emit(this.toolbarEvents);
    this.$subscriptions = this.commentService.getUnsavedChanges()
      .subscribe(changes => this.onCommentChange(changes));
    this.$subscriptions.add(this.toolbarEvents.getShowCommentSummary()
      .subscribe(changes => this.showCommentSummary = changes));
  }

  ngAfterViewChecked(): void {
    if (this.height && this.viewerHeight !== this.height) {
      this.viewerHeight = this.height;
      this.cdr.detectChanges();
      return;
    }

    if (!this.height) {
      const compOffsetTop = this.elRef.nativeElement.getBoundingClientRect().top;
      const viewerOffsetTop = this.viewerRef.nativeElement.offsetTop;
      const offset = compOffsetTop + viewerOffsetTop;

      if (this.prevOffset !== offset) {
        this.viewerHeight = `calc(100vh - ${offset}px)`;
        this.prevOffset = offset;
        this.cdr.detectChanges();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.annotationApiUrl) {
      this.api.annotationApiUrl = this.annotationApiUrl;
    }

    if (changes.url) {
      this.toolbarEvents.reset();
      this.commentService.resetCommentSet();
      this.documentId = this.extractDMStoreDocId(this.url);
      this.store.dispatch(new fromDocumentActions.SetDocumentId(this.documentId));
      if (this.enableAnnotations && !(this.multimediaContent || this.unsupportedContent)) {
        this.store.dispatch(new fromAnnoActions.LoadAnnotationSet(this.documentId));
      }
      if (this.enableRedactions && !(this.multimediaContent || this.unsupportedContent)) {
        this.store.dispatch(new fromRedactActions.LoadRedactions(this.documentId));
      }
      if (this.contentType === 'image') {
        this.documentTitle = null;
      }
    }

    if (changes.contentType) {
      this.convertibleContent = this.needsConverting();
      this.multimediaContent = this.isMultimedia();
      this.unsupportedContent = !this.isSupported();
    }

    this.setToolbarButtons();
    this.detectOs();
    this.typeException = false;
  }

  ngOnDestroy() {
    this.$subscriptions.unsubscribe();
  }

  needsConverting(): boolean {
    return this.contentType !== null && Object.keys(ConvertibleContentTypes).includes(this.contentType.toUpperCase());
  }

  isMultimedia(): boolean {
    return this.contentType !== null && Object.keys(MultimediaContentTypes).includes(this.contentType.toUpperCase());
  }

  isSupported(): boolean {
    const supportedTypes = Object.assign({}, MultimediaContentTypes, ConvertibleContentTypes, CoreContentTypes);
    return this.contentType !== null && Object.keys(supportedTypes).includes(this.contentType.toUpperCase());
  }

  onMediaLoad(status: ResponseType) {
    this.mediaLoadStatus.emit(status);
  }

  setToolbarButtons() {
    if (this.contentType === CoreContentTypes.PDF || this.needsConverting()) {
      this.toolbarButtons.setup({
        ...defaultPdfOptions, showHighlightButton: this.enableAnnotations, showDrawButton: this.enableAnnotations,
        ...this.toolbarButtonOverrides
      });
    } else if (this.contentType === CoreContentTypes.IMAGE) {
      this.toolbarButtons.setup({
        ...defaultImageOptions, showDrawButton: this.enableAnnotations,
        ...this.toolbarButtonOverrides
      });
    } else if (this.isMultimedia()) {
      this.toolbarButtons.setup({
        ...defaultMultimediaOptions,
        ...this.toolbarButtonOverrides
      });
    } else {
      this.toolbarButtons.setup({
        ...defaultUnsupportedOptions,
        ...this.toolbarButtonOverrides
      });
    }
  }

  onLoadException(exception: ViewerException) {
    this.viewerException.emit(exception);
    if (!this.isSupported()) {
      this.typeException = false;
    } else {
      this.typeException = true;
      this.contentType = null;
      this.setToolbarButtons();
    }
  }

  onCommentChange(changes: boolean) {
    this.unsavedChanges.emit(changes);
  }

  onDocumentTitleChange(title: string) {
    this.documentTitle = title;
  }

  // If secure mode is enabled (which adds "documentsv2" to the documentId), get rid of it
  private extractDMStoreDocId(url: string): string {
    url = url.includes('/documents/') ? url.split('/documents/')[1] : url;
    url = url.includes('/documentsv2/') ? url.split('/documentsv2/')[1] : url;
    return url.replace('/binary', '');
  }

  detectOs() {
    this.hasScrollBar = window.navigator.userAgent.indexOf('Win') !== -1;
  }
}
