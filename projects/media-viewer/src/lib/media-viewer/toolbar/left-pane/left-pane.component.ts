import { Component, Input } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ActionEvents, ChangePageByDeltaOperation, SetCurrentPageOperation} from '../../media-viewer.model';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class ToolbarLeftPaneComponent {

  @Input() toggleSidebarOpen: BehaviorSubject<boolean>;
  @Input() toggleSearchBarHidden: BehaviorSubject<boolean>;
  @Input() actionEvents: ActionEvents;
  @Input() pageNumber = 1;

  constructor() {}

  toggleSideBar() {
    this.toggleSidebarOpen.next(!this.toggleSidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.toggleSearchBarHidden.next(!this.toggleSearchBarHidden.getValue());
  }

  increasePageNumber() {
    this.actionEvents.changePageByDelta.next(new ChangePageByDeltaOperation(1));
  }

  decreasePageNumber() {
    this.actionEvents.changePageByDelta.next(new ChangePageByDeltaOperation(-1));
  }

  setCurrentPageNumber(pageNumber: string) {
    this.actionEvents.setCurrentPage.next(new SetCurrentPageOperation(Number.parseInt(pageNumber, 0)));
  }

  @Input()
  set currentPage(operation: SetCurrentPageOperation | null) {
    if (operation) {
      this.pageNumber = operation.pageNumber;
    }
  }

}
