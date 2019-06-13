import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from './comment.model';
import { User } from '../user/user.model';

@Component({
  selector: 'mv-anno-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  private readonly MAX_COMMENT_LENGTH = 50;

  editable = false;
  lastUpdate: string;
  fullComment: string;
  author: User;
  editor: User;

  @Output() click = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Input() top: number;
  @Input() left : number;
  @Input() selected: boolean;

  @Input()
  set comment(comment: Comment) {
    this.lastUpdate = comment.lastModifiedDate ? comment.lastModifiedDate : comment.createdDate;
    this.author = comment.createdByDetails;
    this.editor = comment.lastModifiedByDetails;
    this.fullComment = comment.content;
  }

  onCommentClick() {
    this.click.emit();
  }

  onEdit() {
    this.editable = true;
  }

  onCancel() {
    this.editable = false;
  }

  commentStyle() {
    return [
      'aui-comment__content',
      'form-control',
      'mimic-focus',
      !this.editable ? 'view-mode' : 'edit-mode',
      !this.selected ? 'collapsed' : 'expanded',
    ];
  }

  get commentText() {
    return !this.selected && this.fullComment.length > this.MAX_COMMENT_LENGTH
      ? this.fullComment.substring(0, this.MAX_COMMENT_LENGTH - 3) + '...'
      : this.fullComment;
  }

  public onDelete() {
    this.delete.emit();
  }

}
