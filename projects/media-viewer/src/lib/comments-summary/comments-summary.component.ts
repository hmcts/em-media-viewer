import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Comment } from '../annotations/comment-set/comment/comment.model';
import { PrintService } from '../print.service';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
  styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent {

  @Input() showCommentSummary: Subject<boolean>;
  @Input() comments: Comment[];
  @Input() title: string;

  @ViewChild('commentContainer') commentsTable: ElementRef;

  constructor(
    private readonly printService: PrintService
  ) {}

  public onClose(): void {
    this.showCommentSummary.next(false);
  }

  public onPrint(): void {
    this.printService.printElementNatively(this.commentsTable.nativeElement, 1000, 900);
  }

}
