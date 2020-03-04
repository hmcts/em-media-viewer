import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'mv-comment-set-header',
  templateUrl: './comment-set-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentSetHeaderComponent {
  @Input() public showCommentSummary: boolean;
  @Output() public readonly showCommentSummaryDialog = new EventEmitter();
  constructor() {}


  public toggleCommentsSummary(): void {
    this.showCommentSummaryDialog.emit();
  }
}
