import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges} from '@angular/core';
import { Comment } from './comment.model';
import { User } from '../../user/user.model';
import { Rectangle } from '../../annotation-set/annotation-view/rectangle/rectangle.model';
import { SelectionAnnotation } from '../../annotation-event.service';
import { CommentService } from './comment.service';

@Component({
  selector: 'mv-anno-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnChanges {

  readonly MAX_COMMENT_LENGTH;
  readonly COMMENT_CHAR_LIMIT;

  lastUpdate: string;
  originalComment: string;
  fullComment: string;
  author: User;
  editor: User;
  _comment: Comment;
  _editable: boolean;

  _rectangle;
  rectTop;
  rectLeft;

  hasUnsavedChanges = false;

  @Output() commentClick = new EventEmitter<SelectionAnnotation>();
  @Output() renderComments = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<Comment>();
  @Output() updated = new EventEmitter<Comment>();
  @Output() changes = new EventEmitter<boolean>();
  @Input() selected = false;
  @Input() rotate = 0;
  @Input() zoom = 1;
  @Input() index: number;
  @Input() page: number;
  @Input() pageHeights = [];
  @ViewChild('form') form: ElementRef;
  @ViewChild('textArea') textArea: ElementRef;

  constructor(
    private readonly commentService: CommentService
  ) {
    this.MAX_COMMENT_LENGTH = 48;
    this.COMMENT_CHAR_LIMIT = 5000;
  }

  ngOnChanges(): void {
    this.reRenderComments();
  }

  @Input()
  set comment(comment: Comment) {
    this._comment = comment;
    this.lastUpdate = comment.lastModifiedDate ? comment.lastModifiedDate : comment.createdDate;
    this.author = comment.createdByDetails;
    this.editor = comment.lastModifiedByDetails;
    this.originalComment = comment.content;
    this.fullComment = this.originalComment;
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
      setTimeout(() => this.textArea.nativeElement.focus(), 10);
    }
  }

  get editable(): boolean {
    return this._editable;
  }

  onEdit() {
    this.editable = true;
  }

  onCommentChange(updatedComment) {
    this.hasUnsavedChanges = this.originalComment.substring(0, this.COMMENT_CHAR_LIMIT) !==
      updatedComment.substring(0, this.COMMENT_CHAR_LIMIT);
    this.commentService.onCommentChange(this.hasUnsavedChanges);
  }

  onCancel() {
    this.hasUnsavedChanges = false;
    this.editable = false;
    this.fullComment = this.originalComment;
    this.changes.emit(false);
  }

  public onDelete() {
    this.delete.emit(this._comment);
  }

  public onSave() {
    this._comment.content = this.fullComment.substring(0, this.COMMENT_CHAR_LIMIT);
    this.updated.emit(this._comment);
    this.editable = false;
    this.hasUnsavedChanges = false;
    this.changes.emit(false);
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

  onFocusOut() {
    if (!this.author && !this.fullComment) {
      this.delete.emit(this._comment);
    }
  }

  formNgStyle() {
    return {
      top: this.getTotalPreviousPagesHeight() + (this.rectTop * this.zoom) + 'px',
      'z-index': this.selected ? 100 : 0
    };
  }

  getTotalPreviousPagesHeight(): number {
    const pageMarginBottom = 10;
    let totalPreviousPagesHeight = 0;
    for (let i = 0; i < this.page - 1; i++) {
      totalPreviousPagesHeight += this.pageHeights[i] + pageMarginBottom;
    }
    return totalPreviousPagesHeight;
  }

  get commentBottomPos(): number {
    return this.rectTop + this.height;
  }

  get height() {
    return this.form.nativeElement.getBoundingClientRect().height / this.zoom;
  }

  commentStyle() {
    return [
      'aui-comment__content',
      'form-control',
      'mimic-focus',
      !this.editable ? 'view-mode' : 'edit-mode',
      !this.selected && !this.editable ? 'collapsed' : 'expanded',
    ];
  }
}
