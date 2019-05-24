import { Component, Input } from '@angular/core';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../model/viewer-operations';
import { ToolbarToggles } from '../../model/toolbar-toggles';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarLeftPaneComponent {

  @Input() toolbarToggles: ToolbarToggles;
  @Input() changePageByDelta: Subject<ChangePageByDeltaOperation>;
  @Input() setCurrentPage: Subject<SetCurrentPageOperation>;
  @Input() pageNumber = 1;

  constructor() {}

  toggleSideBar() {
    this.toolbarToggles.sidebarOpen.next(!this.toolbarToggles.sidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.toolbarToggles.searchBarHidden.next(!this.toolbarToggles.searchBarHidden.getValue());
  }

  increasePageNumber() {
    this.changePageByDelta.next(new ChangePageByDeltaOperation(1));
  }

  decreasePageNumber() {
    this.changePageByDelta.next(new ChangePageByDeltaOperation(-1));
  }

  setCurrentPageNumber(pageNumber: string) {
    this.setCurrentPage.next(new SetCurrentPageOperation(Number.parseInt(pageNumber, 0)));
  }

  @Input()
  set currentPage(operation: SetCurrentPageOperation | null) {
    if (operation) {
      this.pageNumber = operation.pageNumber;
    }
  }

}
