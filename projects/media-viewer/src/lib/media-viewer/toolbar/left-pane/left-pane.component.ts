import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class ToolbarLeftPaneComponent {

  @Input() toggleSidebarOpen: BehaviorSubject<boolean>;
  @Input() toggleSearchbarHidden: BehaviorSubject<boolean>;

  constructor() {}

  toggleSideBar() {
    this.toggleSidebarOpen.next(!this.toggleSidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.toggleSearchbarHidden.next(!this.toggleSearchbarHidden.getValue());
  }
}
