import { Component, Input } from '@angular/core';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../events/viewer-operations';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarLeftPaneComponent {

  @Input() changePageByDelta: Subject<ChangePageByDeltaOperation>;
  @Input() setCurrentPage: Subject<SetCurrentPageOperation>;
  @Input() pageNumber = 1;
  @Input() showSidebarToggleBtn: boolean;
  @Input() showSearchbarToggleBtn: boolean;
  @Input() showHighlightBtn: boolean;
  @Input() showNavigationBtns: boolean;
  @Input() sidebarOpen: BehaviorSubject<boolean>;
  @Input() searchBarHidden: BehaviorSubject<boolean>;
  @Input() drawMode: BehaviorSubject<boolean>;

  constructor() {}

  toggleSideBar() {
    this.sidebarOpen.next(!this.sidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.searchBarHidden.next(!this.searchBarHidden.getValue());
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

  onClickDraw() {
    this.drawMode.next(!this.drawMode.value);
  }
}
