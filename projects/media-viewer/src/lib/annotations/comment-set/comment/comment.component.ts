import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Comment} from './comment.model';
import {User} from '../../models/user.model';
import {Rectangle} from '../../annotation-set/annotation-view/rectangle/rectangle.model';
import {SelectionAnnotation} from '../../models/event-select.model';
import {CommentService} from './comment.service';
import {TagItemModel} from '../../models/tag-item.model';
import {TagsServices} from '../../services/tags/tags.services';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as fromStore from '../../../store';

@Component({
  selector: 'mv-anno-comment',
  templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit, OnDestroy {
  COMMENT_CHAR_LIMIT = 5000;
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
  pageHeight: number;
  hasUnsavedChanges = false;
  selected: boolean;
  searchString: string;
  public tagItems: TagItemModel[];


  @Output() commentClick = new EventEmitter<SelectionAnnotation>();
  @Output() renderComments = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<Comment>();
  @Output() updated = new EventEmitter<{comment: Comment, tags: TagItemModel[]}>();
  @Output() changes = new EventEmitter<boolean>();
  @Input() rotate = 0;
  @Input() zoom = 1;
  @Input() index: number;
  @Input() page: number;

  @ViewChild('form') form: ElementRef;
  @ViewChild('editableComment') editableComment: ElementRef<HTMLElement>;

  private subscriptions: Subscription;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly commentService: CommentService,
    private tagsServices: TagsServices
  ) {}


  ngOnInit(): void {
    this.subscriptions = this.store.select(fromStore.getComponentSearchText)
      .pipe(distinctUntilChanged()).subscribe(searchString => this.searchString = searchString);
    this.reRenderComments();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @Input()
  set comment(comment: Comment) {
    this._comment = {...comment};
    this.page = this._comment.page;
    this.pageHeight = this._comment.pageHeight;
    this.lastUpdate = comment.lastModifiedDate ? comment.lastModifiedDate : comment.createdDate;
    this.author = comment.createdByDetails;
    this.createdBy = comment.createdBy;
    this.editor = comment.lastModifiedByDetails;
    this.originalComment = comment.content;
    this.fullComment = this.originalComment;
    this.tagItems = this.tagsServices.getTagItems(this._comment.annotationId);

    this.selected = this._comment.selected;
    this._editable = this._comment.editable;

    const pageMarginBottom = 10;
    this.totalPreviousPagesHeight = 0;
    for (let i = 0; i < this.page - 1; i++) {
      this.totalPreviousPagesHeight += this.pageHeight + pageMarginBottom;
    }
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

  get editable(): boolean {
    return this._editable;
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
      this._editable = false;
      this.fullComment = this.originalComment;
      this.changes.emit(false);
      if (!this.author && !this.fullComment) {
        this.delete.emit(this._comment);
      }
    }
  }

  public editOrSave() {
    if (!this.editable) {
      this._editable = true;
    } else {
      this._comment.content = this.fullComment.substring(0, this.COMMENT_CHAR_LIMIT);
      const tags = this.tagsServices.getTagItems(this._comment.annotationId);
      const payload = {
        comment: this._comment,
        tags
      };
      this.updated.emit(payload);
      this.hasUnsavedChanges = false;
      this._editable = false;
      this.changes.emit(false);
    }
  }

  onCommentClick() {
    if (!this.selected) {
      this.selected = true;
      this._editable = false;
      this.commentClick.emit({ annotationId: this._comment.annotationId, editable: this._editable, selected: true });
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
