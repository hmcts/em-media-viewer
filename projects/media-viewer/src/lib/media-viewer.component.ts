import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  defaultImageOptions,
  defaultPdfOptions,
  defaultUnsupportedOptions,
  ToolbarButtonVisibilityService
} from './toolbar/toolbar-button-visibility.service';
import { AnnotationSet } from './annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from './toolbar/toolbar-event.service';
import { AnnotationApiService } from './annotations/annotation-api.service';
import { ResponseType, ViewerException } from './viewers/viewer-exception.model';
import { CommentService } from './annotations/comment-set/comment/comment.service';
import 'hammerjs';
import { select, Store } from '@ngrx/store';
import * as fromStore from './store/reducers/reducers';
import * as fromAnnoSelectors from './store/selectors/annotations.selectors';
import * as fromDocumentsSelector from './store/selectors/document.selectors';
import * as fromAnnoActions from './store/actions/annotations.action';
import { Rotation } from './viewers/rotation.model';
import * as fromDocumentActions from './store/actions/document.action';
import { filter, take } from 'rxjs/operators';

enum SupportedContentTypes {
  PDF = 'pdf',
  IMAGE = 'image'
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

  @Input() enableRedactions = false;
  @Input() enableICP = false;

  @Input() caseId: string;

  rotation = 0;
  savedRotation = 0;
  documentTitle: string;
  showCommentSummary: boolean;
  annotationSet$: Observable<AnnotationSet | {}>;
  hasScrollBar: boolean;
  typeException = false;
  hasDifferentPageSize$: Observable<boolean>;

  private $subscriptions: Subscription;

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
    this.annotationSet$ = this.store.pipe(select(fromAnnoSelectors.getAnnotationSet));
    this.hasDifferentPageSize$ = this.store.pipe(select(fromDocumentsSelector.getPageDifference));
    this.setToolbarButtons();
    this.toolbarEventsOutput.emit(this.toolbarEvents);
    this.$subscriptions = this.commentService.getUnsavedChanges()
      .subscribe(changes => this.onCommentChange(changes));
    this.$subscriptions.add(this.toolbarEvents.getShowCommentSummary()
      .subscribe(changes => this.showCommentSummary = changes));
    this.$subscriptions.add(this.store.pipe(select(fromDocumentsSelector.getRotation))
        .subscribe(rotation => this.savedRotation = rotation ));
    this.$subscriptions.add(this.toolbarEvents.rotateSubject.subscribe(rotation => this.onRotate(rotation)));
    this.$subscriptions.add(this.toolbarEvents.saveRotationSubject.subscribe(() => this.saveRotation()));
  }

  contentTypeConvertible(): boolean {
    return this.contentType !== null && Object.keys(ConvertibleContentTypes).includes(this.contentType.toUpperCase());
  }

  contentTypeUnsupported(): boolean {
    const supportedTypes = Object.keys(SupportedContentTypes).concat(Object.keys(ConvertibleContentTypes));
    return this.contentType === null || !supportedTypes.includes(this.contentType.toUpperCase());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.annotationApiUrl) {
      this.api.annotationApiUrl = this.annotationApiUrl;
    }
    if (changes.url) {
      this.toolbarEvents.reset();
      this.commentService.resetCommentSet();
      if (this.enableAnnotations) {
        const documentId = this.extractDMStoreDocId(this.url);
        this.store.dispatch(new fromAnnoActions.LoadAnnotationSet(documentId));
      }
      if (this.contentType === 'image') {
        this.documentTitle = null;
      }
    }
    this.setToolbarButtons();
    this.detectOs();
    this.typeException = false;
  }

  ngOnDestroy() {
    this.$subscriptions.unsubscribe();
  }

  onMediaLoad(status: ResponseType) {
    this.setInitialRotation();
    this.mediaLoadStatus.emit(status);
  }

  setToolbarButtons() {
    if (this.contentType === SupportedContentTypes.PDF || this.contentTypeConvertible()) {
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
    if (this.contentTypeUnsupported()) {
      this.typeException = false;
    } else {
      this.typeException = true;
      this.contentType = null;
      this.setToolbarButtons();
    }
  }

  private setInitialRotation() {
    this.rotation = 0;
    const documentId = this.extractDMStoreDocId(this.url);
    this.store.dispatch(new fromDocumentActions.LoadRotation(documentId));
    this.store.pipe(select(fromDocumentsSelector.rotationLoaded),
      filter(value => !!value),
      take(1))
      .subscribe(() => {
        if (this.savedRotation) {
          this.toolbarEvents.rotateSubject.next(this.savedRotation);
        }
      })
  }

  private onRotate(rotation: number) {
    this.rotation = (this.rotation + rotation) %360;
    this.toolbarButtons.showSaveRotationButton = this.savedRotation !== this.rotation;
  }

  private saveRotation() {
    const payload: Rotation = {
      documentId: this.extractDMStoreDocId(this.url),
      rotationAngle: this.rotation
    }
    this.store.dispatch(new fromDocumentActions.SaveRotation(payload));
  }

  onCommentChange(changes: boolean) {
    this.unsavedChanges.emit(changes);
  }

  onDocumentTitleChange(title: string) {
    this.documentTitle = title;
  }

  private extractDMStoreDocId(url: string): string {
    url = url.includes('/documents/') ? url.split('/documents/')[1] : url;
    return url.replace('/binary', '');
  }

  detectOs() {
    this.hasScrollBar = window.navigator.userAgent.indexOf('Win') !== -1;
  }
}
