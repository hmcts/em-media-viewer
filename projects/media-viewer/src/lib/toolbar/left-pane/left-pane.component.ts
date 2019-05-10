import { Component, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../toolbar.component.scss']
})
export class ToolbarLeftPaneComponent {

  @Output() sidebarToggle = new BehaviorSubject(true);
  @Output() searchToggle = new BehaviorSubject(true);

  constructor() {}

  toggleSidebar() {
    this.sidebarToggle.next(true);
  }

  toggleSearch() {
    this.searchToggle.next(true);
  }
}
