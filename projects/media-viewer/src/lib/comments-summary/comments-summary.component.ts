import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Comment } from '../annotations/comment/comment.model';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
  styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent {
  @Input() showCommentSummary: Subject<boolean>;

  @Input() comments: Comment[];

  @ViewChild('commentContainer') commentsTable: ElementRef;

  public onClose(): void {
    this.showCommentSummary.next(false);
  }

  public onPrint(): void {
    const printElement = this.commentsTable.nativeElement;
    const printWindow = window.open('', '', 'left=0,top=0,width=1000,height=900,toolbar=0,scrollbars=0,status=0');
    printWindow.document.write(printElement.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

}
