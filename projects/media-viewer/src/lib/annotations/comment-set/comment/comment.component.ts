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
  @Input() rotate = 0;
  @Input() zoom = 1;
  @ViewChild('form') form: ElementRef;
  @ViewChild('textArea') textArea: ElementRef;

  constructor() {
    this.MAX_COMMENT_LENGTH = 48;
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

  onCancel() {
    this.editable = false;
    this.fullComment = this.originalComment;
  }

  public onDelete() {
    this.delete.emit(this._comment);
  }

  public onSave() {
    this._comment.content = this.fullComment.length > 5000 ? this.fullComment.slice(0, 5000) : this.fullComment;
    this.updated.emit(this._comment);
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

  get commentText() {
    return !this.selected && this.fullComment.length > this.MAX_COMMENT_LENGTH
      ? this.fullComment.substring(0, this.MAX_COMMENT_LENGTH - 3) + '...'
      : this.fullComment;
  }

  set commentText(text: string) {
    this.fullComment = text;
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
