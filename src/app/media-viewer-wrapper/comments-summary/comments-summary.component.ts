import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-comments-summary',
  templateUrl: './comments-summary.component.html',
  styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent {

  @Input() showCommentSummary: Subject<boolean>;

  comments: Subject<Comment[]>;

  public onCloseButton(): void {
    this.showCommentSummary.next(false);
  }
}
