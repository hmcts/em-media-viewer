import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {
  defaultImageOptions,
  defaultPdfOptions,
  defaultUnsupportedOptions,
  ToolbarButtonVisibilityService
} from './toolbar/toolbar-button-visibility.service';
import {AnnotationSet} from './annotations/annotation-set/annotation-set.model';
import {ToolbarEventService} from './toolbar/toolbar-event.service';
import {AnnotationApiService} from './annotations/annotation-api.service';
import {ResponseType, ViewerException} from './viewers/error-message/viewer-exception.model';
import {CommentService} from './annotations/comment-set/comment/comment.service';
import 'hammerjs';
import {tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as fromStore from './store';

enum SupportedContentTypes {
  PDF = 'pdf',
  IMAGE = 'image'
}

@Component({
  selector: 'mv-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['styles/main.scss', './media-viewer.component.scss']
})
export class MediaViewerComponent implements OnChanges, OnDestroy, AfterContentInit {

  @Input() url;
  @Input() downloadFileName: string;
  @Input() contentType: string;

  @Input() showToolbar = true;
  @Input() toolbarButtonOverrides: any = {};
  @Input() height = 'calc(100vh - 32px)';
  @Input() width = '100%';

  @Output() mediaLoadStatus = new EventEmitter<ResponseType>();
  @Output() viewerException = new EventEmitter<ViewerException>();
  @Output() toolbarEventsOutput = new EventEmitter<ToolbarEventService>();
  @Output() unsavedChanges = new EventEmitter<boolean>();

  @Input() enableAnnotations = false;
  @Input() annotationApiUrl;

  documentTitle: string;
  showCommentSummary: boolean;
  annotationSet: Observable<AnnotationSet>;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService,
    private readonly api: AnnotationApiService,
    private readonly commentService: CommentService
  ) {
    if (this.annotationApiUrl) {
      api.annotationApiUrl = this.annotationApiUrl;
    }
  }

  ngAfterContentInit() {
    this.setToolbarButtons();
    this.toolbarEventsOutput.emit(this.toolbarEvents);
    this.subscriptions.push(
      this.commentService.getUnsavedChanges().subscribe(changes => this.onCommentChange(changes)),
      this.toolbarEvents.getShowCommentSummary().subscribe(changes => this.showCommentSummary = changes)
    );
  }

  contentTypeUnsupported(): boolean {
    return this.contentType === null || !Object.keys(SupportedContentTypes).includes(this.contentType.toUpperCase());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.annotationApiUrl) {
      this.api.annotationApiUrl = this.annotationApiUrl;
    }
    if (changes.url) {
      this.toolbarEvents.reset();
      this.commentService.resetCommentSet();
      if (this.enableAnnotations) {
        this.store.dispatch(new fromStore.LoadAnnotationSet(this.url));
        // this.annotationSet = this.api.getAnnotationSet(this.url).pipe(tap(console.log));
      }
      if (this.contentType === 'image') {
        this.documentTitle = null;
      }
    }
    if (changes.enableAnnotations && this.enableAnnotations) {
      this.store.dispatch(new fromStore.LoadAnnotationSet(this.url));
      // this.annotationSet = this.api.getAnnotationSet(this.url).pipe(tap(console.log));
    }
    this.setToolbarButtons();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onMediaLoad(status: ResponseType) {
    this.mediaLoadStatus.emit(status);
  }

  setToolbarButtons() {
    if (this.contentType === SupportedContentTypes.PDF) {
      this.toolbarButtons.setup({
        ...defaultPdfOptions, showHighlightButton: this.enableAnnotations, showDrawButton: this.enableAnnotations,
        ...this.toolbarButtonOverrides
      });
    } else if (this.contentType === SupportedContentTypes.IMAGE) {
      this.toolbarButtons.setup({
        ...defaultImageOptions, showDrawButton: this.enableAnnotations,
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
  }

  onCommentChange(changes: boolean) {
    this.unsavedChanges.emit(changes);
  }

  onDocumentTitleChange(title: string) {
    this.documentTitle = title;
  }
}
