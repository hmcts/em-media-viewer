import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import { AnnotationSet } from '../../annotation-set/annotation-set.model';

@Component({
  selector: 'mv-comment-set-header',
  templateUrl: './comment-set-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentSetHeaderComponent {

  @Input() public readonly annotationSet: AnnotationSet[];
  @Input() public showCommentSummary: boolean;
  @Output() public readonly showCommentSummaryDialog = new EventEmitter();

  showCommentSearch = false;

  public toggleCommentsSummary(): void {
    this.showCommentSummaryDialog.emit();
  }

  toggleCommentSearch() {
    this.showCommentSearch = !this.showCommentSearch;
  }
}
