import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'mv-comment-set-header',
  templateUrl: './comment-set-header.component.html',
  styleUrls: ['./comment-set-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommentSetHeaderComponent {
  @Input() showCommentSummary: boolean;
  @Output() showCommentSummaryDialog = new EventEmitter();
  constructor() {}


  toggleCommentsSummary(): void {
    this.showCommentSummaryDialog.emit();
  }
}
