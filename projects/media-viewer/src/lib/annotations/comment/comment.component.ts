import { Component, Input, OnInit } from '@angular/core';
import { Comment } from './comment.model';
import { User } from '../user/user.model';

@Component({
  selector: 'mv-anno-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  editable: boolean;
  expanded: boolean;
  sliceComment: string;
  lastUpdate: string;
  author: User;
  editor: User;
  content: string;
  @Input() user: User;
  @Input() height: number;

  @Input()
  set comment(comment: Comment) {
    this.lastUpdate = comment.lastModifiedDate ? comment.lastModifiedDate : comment.createdDate;
    this.author = comment.createdByDetails;
    this.editor = comment.lastModifiedByDetails;
    this.content = comment.content;
  }


  ngOnInit() {
    this.editable = false;
    this.expanded = true;
    this.sliceComment = this.content;
  }

  onCommentClick() {
    this.expanded = true;
  }

  onEdit() {
    this.editable = true;
  }

  onCancel() {
    this.editable = false;
  }

  commentStyle() {
    return 'aui-comment__content form-control mimic-focus ' + (!this.editable ? 'view-mode' : 'edit-mode');
  }
}
