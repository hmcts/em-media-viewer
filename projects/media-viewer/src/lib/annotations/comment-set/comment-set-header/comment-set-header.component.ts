import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AnnotationSet } from '../../annotation-set/annotation-set.model';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';

@Component({
  selector: 'mv-comment-set-header',
  templateUrl: './comment-set-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentSetHeaderComponent implements OnChanges {

  @Input() public readonly annotationSet: AnnotationSet;
  @Input() public showCommentSummary: boolean;
  @Output() public readonly showCommentSummaryDialog = new EventEmitter();

  tabs = ['comments', 'filter', 'search'];
  tabSelected: string;
  navigationList: Annotation[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.annotationSet && this.annotationSet) {
      this.navigationList = [...this.annotationSet.annotations]
        .filter(annotation => annotation.comments && annotation.comments.length > 0);
    }
  }

  public toggleCommentsSummary(): void {
    this.showCommentSummaryDialog.emit();
  }

  selectTab(tab: string) {
    this.tabSelected = tab !== this.tabSelected ? tab : undefined;
  }
}
