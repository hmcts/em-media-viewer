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
  @Input() comment: Comment;
  @Input() user: User;
  @Input() height: number;

  ngOnInit() {
    this.editable = false;
    this.expanded = true;
    this.sliceComment = this.comment.content;
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
}
