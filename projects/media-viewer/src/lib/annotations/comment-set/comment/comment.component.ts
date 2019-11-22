import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Comment } from './comment.model';
import { User } from '../../user/user.model';
import { Rectangle } from '../../annotation-set/annotation/rectangle/rectangle.model';
import { SelectionAnnotation } from '../../annotation.service';

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
  _selected: boolean;

  _rectangle;
  commentTopPos;
  commentLeftPos;

  @Output() commentClick = new EventEmitter<SelectionAnnotation>();
  @Output() commentRendered = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<Comment>();
  @Output() updated = new EventEmitter<Comment>();
  @Output() unsavedChanges = new EventEmitter<boolean>();
  @Input() rotate = 0;
  @Input() zoom = 1;
  @Input() index: number;
  @ViewChild('form') form: ElementRef;
  @ViewChild('textArea') textArea: ElementRef;

  constructor() {
    this.MAX_COMMENT_LENGTH = 48;
    this.COMMENT_CHAR_LIMIT = 5000;
  }

  ngOnChanges(): void {
    this.commentRendered.emit(this._comment);
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

  @Input()
  set rectangle(rectangle: Rectangle) {
    this._rectangle = rectangle;
    this.commentTopPos = this._rectangle.y;
    this.commentLeftPos = this._rectangle.x;
  }

  @Input()
  set selected(selected: boolean) {
    this._selected = selected;
  }

  get selected() {
    return this._selected;
  }

  @Input()
  set editable(editable: boolean) {
    this._editable = editable;
    if (editable) {
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
    if (this.originalComment.substring(0, this.COMMENT_CHAR_LIMIT) !== updatedComment.substring(0, this.COMMENT_CHAR_LIMIT)) {
      this.unsavedChanges.emit(true);
    } else {
      this.unsavedChanges.emit(false);
    }
  }

  onCancel() {
    this.editable = false;
    this.unsavedChanges.emit(false);
    this.fullComment = this.originalComment;
  }

  public onDelete() {
    this.delete.emit(this._comment);
  }

  public onSave() {
    this._comment.content = this.fullComment.substring(0, this.COMMENT_CHAR_LIMIT);
    this.updated.emit(this._comment);
    this.unsavedChanges.emit(false);
    this.editable = false;
  }

  onCommentClick() {
    if (!this._selected) {
      this.selected = true;
      this.commentClick.emit({ annotationId: this._comment.annotationId, editable: this._editable });
    }
  }

  onFocusOut() {
    if (!this.author && !this.fullComment) {
      this.delete.emit(this._comment);
    }
  }

  formNgStyle() {
    return {
      top: (this.commentTopPos * this.zoom) + 'px'
    };
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
