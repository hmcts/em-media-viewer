import { Component, Input } from '@angular/core';
import { ActionEvents, RotateOperation } from '../media-viewer.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./styles/toolbar.component.scss']
})
export class ToolbarComponent {

  sidebarToggle = false;
  searchToggle = false;
  subToolbarToggle = true;

  constructor() {}

  @Input() actionEvents: ActionEvents;

  toggleSidebar() {
    this.sidebarToggle = !this.sidebarToggle;
  }

  toggleSearch() {
    this.searchToggle = !this.searchToggle;
  }

  toggleSubToolbar() {
    this.subToolbarToggle = !this.subToolbarToggle;
  }

  rotate(rotation: number) {
    this.actionEvents.rotate.next(new RotateOperation(rotation));
  }
}
