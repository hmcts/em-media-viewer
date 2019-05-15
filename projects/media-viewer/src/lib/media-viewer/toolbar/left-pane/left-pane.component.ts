import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarLeftPaneComponent {

  @Input() toggleSidebarOpen: BehaviorSubject<boolean>;
  @Input() toggleSearchBarHidden: BehaviorSubject<boolean>;

  constructor() {}

  toggleSideBar() {
    this.toggleSidebarOpen.next(!this.toggleSidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.toggleSearchBarHidden.next(!this.toggleSearchBarHidden.getValue());
  }
}
