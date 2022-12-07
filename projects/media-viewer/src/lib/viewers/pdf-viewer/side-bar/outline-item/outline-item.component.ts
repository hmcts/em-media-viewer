import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Outline } from './outline.model';

@Component({
  selector: 'mv-outline-item',
  templateUrl: './outline-item.component.html'
})
export class OutlineItemComponent implements OnInit {

  @Input() outline: Outline;
  @Input() currentPageNumber: Number;
  @Input() isCurrentSection: boolean;
  @Input() endPage: Number;
  @Output() navigationEvent = new EventEmitter();

  showOutlineItems: boolean;

  ngOnInit() {
    this.showOutlineItems = true;
    if (this.endPage === undefined) {
      this.endPage = Number.MAX_SAFE_INTEGER;
    }
  }

  goToDestination(destination: any) {
    if (destination) {
      this.navigationEvent.emit(destination);
    }
  }

  toggleOutline() {
    this.showOutlineItems = !this.showOutlineItems;
  }
}
