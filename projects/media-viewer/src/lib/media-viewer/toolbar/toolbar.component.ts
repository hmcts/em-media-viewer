import { Component, Input } from '@angular/core';
import { ActionEvents, RotateOperation } from '../media-viewer.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() url = '';
  @Input() contentType: string;
  sidebarToggle = false;
  searchToggle = false;
  secondaryToolbarToggle = true;

  constructor() {}

  @Input() actionEvents: ActionEvents;

  toggleSidebar() {
    this.sidebarToggle = !this.sidebarToggle;
  }

  toggleSearch() {
    this.searchToggle = !this.searchToggle;
  }

  toggleSecondaryToolbar() {
    this.secondaryToolbarToggle = !this.secondaryToolbarToggle;
  }

  rotate(rotation: number) {
    this.actionEvents.rotate.next(new RotateOperation(rotation));
  }
}
