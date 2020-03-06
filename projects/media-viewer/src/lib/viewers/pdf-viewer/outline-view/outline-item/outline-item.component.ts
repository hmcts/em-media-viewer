import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Outline } from '../outline.model';

@Component({
  selector: 'mv-outline-item',
  templateUrl: './outline-item.component.html',
  styleUrls: ['../../../../styles/main.scss'],
})
export class OutlineItemComponent implements OnInit {

  @Input() outline: Outline;
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
}
