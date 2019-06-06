import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Comment } from '../annotations/comment/comment.model';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
  styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent {

  @Input() showCommentSummary: Subject<boolean>;

  @Input() comments: Subject<Comment[]>;

  public onClose(): void {
    this.showCommentSummary.next(false);
  }
}
