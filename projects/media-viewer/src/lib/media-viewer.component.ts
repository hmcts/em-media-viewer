import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy, OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  defaultImageOptions,
  defaultPdfOptions,
  defaultUnsupportedOptions,
  ToolbarButtonVisibilityService
} from './toolbar/toolbar-button-visibility.service';
import { AnnotationSet } from './annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from './toolbar/toolbar-event.service';
import { AnnotationApiService } from './annotations/annotation-api.service';
import { ResponseType, ViewerException } from './viewers/error-message/viewer-exception.model';
import { CommentService } from './annotations/comment-set/comment/comment.service';
import { Subscription } from 'rxjs';

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
  @Input() showCommentSummary: Subject<boolean>;
  @Input() annotationApiUrl;

  annotationSet: Observable<AnnotationSet>;
  private commentState: Subscription;

  constructor(
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
    this.commentState = this.commentService.getUnsavedChanges()
      .subscribe(changes => this.onCommentChange(changes));
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
        this.annotationSet = this.api.getOrCreateAnnotationSet(this.url);
      }
    }
    if (changes.enableAnnotations && this.enableAnnotations) {
      this.annotationSet = this.api.getOrCreateAnnotationSet(this.url);
    }
    this.setToolbarButtons();
  }

  ngOnDestroy() {
    this.commentState.unsubscribe();
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
}

enum SupportedContentTypes {
  PDF = 'pdf',
  IMAGE = 'image'
}
