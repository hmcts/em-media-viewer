import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Outline } from './outline.model';

@Component({
  selector: 'mv-outline-view',
  templateUrl: './outline-view.component.html',
  styleUrls: ['../../../styles/main.scss'],
})
export class OutlineViewComponent {

  @Input() outline: Outline;
  @Output() navigationEvent = new EventEmitter();

  goToDestination(destination: any) {
    this.navigationEvent.emit(destination);
  }
}
