import { Component, Input, Output } from '@angular/core';
import { ActionEvents, RotateOperation } from '../media-viewer.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./styles/toolbar.component.scss']
})
export class ToolbarComponent {

  sidebarOpen = new BehaviorSubject(false);
  searchbarHide = new BehaviorSubject(true);
  subToolbarHide = new BehaviorSubject(true);

  constructor() {}

  @Input() actionEvents: ActionEvents;

  rotate(rotation: number) {
    this.actionEvents.rotate.next(new RotateOperation(rotation));
  }
}
