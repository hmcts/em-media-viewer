import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Outline } from './outline.model';

@Component({
    selector: 'mv-outline-item',
    templateUrl: './outline-item.component.html',
    standalone: false
})
export class OutlineItemComponent implements OnInit {

  @Input() outline: Outline;
  @Input() currentPageNumber: number;
  @Input() isCurrentSection: boolean;
  @Input() endPage: number;
  @Output() navigationEvent = new EventEmitter();

  showOutlineItems: boolean;

  ngOnInit() {
    this.showOutlineItems = true;
  }

  goToDestination(destination: any) {
    if (destination) {
      this.navigationEvent.emit(destination);
    }
  }

  toggleOutline() {
    this.showOutlineItems = !this.showOutlineItems;
  }

  isViewedItem(current: Outline, next: Outline): boolean {
    if (current.pageNumber === this.currentPageNumber) {
      return true;
    }
    return next === undefined ? current.pageNumber <= this.currentPageNumber && this.endPage > this.currentPageNumber :
      current.pageNumber <= this.currentPageNumber && (next.pageNumber > this.currentPageNumber);
  }

  findEndPage(next: Outline): number {
    return next === undefined ? this.endPage : next.pageNumber;
  }

  showHighlightOutlineCss() {
    return this.isCurrentSection ? 'highlightedOutlineItem' : 'outlineItem';
  }
}
