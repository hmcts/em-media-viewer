import { TagItemModel } from '../../models/tag-item.model';
import { TagsServices } from '../../services/tags/tags.services';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { User } from '../../models/user.model';
import { AnnotationEventService, SelectionAnnotation } from '../../annotation-event.service';
import { Subscription } from 'rxjs';
import { CommentService } from './comment.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Rectangle } from '../../annotation-set/annotation-view/rectangle/rectangle.model';
import { Comment } from './comment.model';

@Component({
  selector: 'mv-anno-comment',
  templateUrl: './comment.component.html'
})
export class CommentComponent implements OnChanges, OnDestroy {

  readonly MAX_COMMENT_LENGTH;
  readonly COMMENT_CHAR_LIMIT;

  lastUpdate: string;
  originalComment: string;
  fullComment: string;
  author: User;
  createdBy: string;
  editor: User;
  _comment: Comment;
  _editable: boolean;

  _rectangle;
  totalPreviousPagesHeight = 0;
  rectTop;
  rectLeft;

  hasUnsavedChanges = false;
  searchString: string;
  tagItems: TagItemModel[];


  @Output() commentClick = new EventEmitter<SelectionAnnotation>();
  @Output() renderComments = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<Comment>();
  @Output() updated = new EventEmitter<{comment: Comment, tags: TagItemModel[]}>();
  @Output() changes = new EventEmitter<boolean>();
  @Input() selected = false;
  @Input() rotate = 0;
  @Input() zoom = 1;
  @Input() index: number;
  @Input() page: number;

  @ViewChild('form') form: ElementRef;
  @ViewChild('editableComment') editableComment: ElementRef<HTMLElement>;

  private subscriptions: Subscription[];

  constructor(private readonly commentService: CommentService,
              private readonly annotationEvents: AnnotationEventService,
    private tagsServices: TagsServices
  ) {
    this.MAX_COMMENT_LENGTH = 48;
    this.COMMENT_CHAR_LIMIT = 5000;

    this.subscriptions = [
      annotationEvents.commentSearch.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchString => this.searchString = searchString),
      annotationEvents.resetHighlightEvent
        .subscribe(() => this.searchString = undefined)
    ];
  }

  ngOnChanges(): void {
    this.reRenderComments();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  @Input()
  set comment(comment: Comment) {
    this._comment = comment;
    this.lastUpdate = comment.lastModifiedDate ? comment.lastModifiedDate : comment.createdDate;
    this.author = comment.createdByDetails;
    this.createdBy = comment.createdBy;
    this.editor = comment.lastModifiedByDetails;
    this.originalComment = comment.content;
    this.fullComment = this.originalComment;
    this.tagItems = this.tagsServices.getTagItems(this._comment.annotationId);
  }

  get comment() {
    return this._comment;
  }

  @Input()
  set rectangle(rectangle: Rectangle) {
    this._rectangle = rectangle;
    this.rectTop = this._rectangle.y;
    this.rectLeft = this._rectangle.x;
  }

  @Input()
  set editable(editable: boolean) {
    this._editable = editable || this.hasUnsavedChanges;
    if (this._editable) {
      setTimeout(() => this.editableComment.nativeElement.focus(), 10);
    }
  }

  get editable(): boolean {
    return this._editable;
  }

  @Input()
  set pageHeights(pageHeights: []) {
    const pageMarginBottom = 10;
    this.totalPreviousPagesHeight = 0;
    for (let i = 0; i < this.page - 1; i++) {
      this.totalPreviousPagesHeight += pageHeights[i] + pageMarginBottom;
    }
  }

  onCommentChange(updatedComment) {
    this.hasUnsavedChanges = this.originalComment.substring(0, this.COMMENT_CHAR_LIMIT) !==
      updatedComment.substring(0, this.COMMENT_CHAR_LIMIT);
    this.commentService.onCommentChange(this.hasUnsavedChanges);
  }

  deleteOrCancel() {
    if (!this.editable) {
      this.delete.emit(this._comment);
    } else {
      this.hasUnsavedChanges = false;
      this.editable = false;
      this.fullComment = this.originalComment;
      this.changes.emit(false);
      if (!this.author && !this.fullComment) {
        this.delete.emit(this._comment);
      }
    }
  }

  public editOrSave() {
    if (!this.editable) {
      this.editable = true;
    } else {
      this._comment.content = this.fullComment.substring(0, this.COMMENT_CHAR_LIMIT);
      const tags = this.tagsServices.getTagItems(this._comment.annotationId);
      const payload = {
        comment: this._comment,
        tags
      };
      this.updated.emit(payload);
      this.hasUnsavedChanges = false;
      this.editable = false;
      this.changes.emit(false);
    }
  }

  onCommentClick() {
    if (!this.selected) {
      this.selected = true;
      this.commentClick.emit({ annotationId: this._comment.annotationId, editable: this._editable });
    }
  }

  reRenderComments() {
    this.renderComments.emit(this._comment);
  }

  get commentTop(): number {
    return this.totalPreviousPagesHeight + (this.rectTop * this.zoom);
  }


  get height() {
    return this.form.nativeElement.getBoundingClientRect().height / this.zoom;
  }
}
