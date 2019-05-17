import { Component, Input } from '@angular/core';
import { ActionEvents } from '../../model/action-events';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../model/viewer-operations';
import { ToolbarToggles } from '../../model/toolbar-toggles';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarLeftPaneComponent {

  @Input() toolbarToggles: ToolbarToggles;
  @Input() actionEvents: ActionEvents;
  @Input() pageNumber = 1;

  constructor() {}

  toggleSideBar() {
    this.toolbarToggles.sidebarOpen.next(!this.toolbarToggles.sidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.toolbarToggles.searchBarHidden.next(!this.toolbarToggles.searchBarHidden.getValue());
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
