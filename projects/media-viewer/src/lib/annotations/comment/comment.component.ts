import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from './comment.model';
import { User } from '../user/user.model';
import {Rectangle} from '../rectangle/rectangle.model';

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
  @Output() updated = new EventEmitter<String>();
  @Input() selected: boolean;
  @Input() rotate: number;
  @Input() zoom: number;
  @Input() rectangle: Rectangle;

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

  formNgStyle() {
    if (this.rotate === 0) {
      return {
        top: this.rectangle.y * this.zoom + 'px',
        right: '0px'
      };
    } else if (this.rotate === 90) {
      return {
        top: '0px',
        left: this.rectangle.x * this.zoom + 'px',
        'transform-origin': 'top left'
      };
    } else if (this.rotate === 180) {
      return {
        top: ((this.rectangle.y * this.zoom) + (this.rectangle.height + this.zoom)) + 'px',
        left: '0px',
        'transform-origin': 'top left'
      };
    } else if (this.rotate === 270) {
      return {
        bottom: '0px',
        left: (this.rectangle.x * this.zoom) + (this.rectangle.width * this.zoom) + 'px',
        'transform-origin': 'top left'
      };
    }
    return null;
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

  set commentText(text: string) {
    this.fullComment = text;
  }

  public onDelete() {
    this.delete.emit();
  }

  public onSave() {
    this.updated.emit(this.fullComment);
    this.editable = false;
  }
}
