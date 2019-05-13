import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class ToolbarLeftPaneComponent {

  @Input() sidebarOpen: BehaviorSubject<boolean>;
  @Input() searchBarHide: BehaviorSubject<boolean>;

  constructor() {}

  toggleSideBar() {
    this.sidebarOpen.next(!this.sidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.searchBarHide.next(!this.searchBarHide.getValue());
  }
}
