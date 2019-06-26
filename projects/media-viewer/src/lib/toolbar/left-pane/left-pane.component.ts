import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../shared/viewer-operations';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {ToolbarEventsService} from '../../shared/toolbar-events.service';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarLeftPaneComponent {
  // Input Properties
  @Input() changePageByDelta: Subject<ChangePageByDeltaOperation>;
  @Input() setCurrentPage: Subject<SetCurrentPageOperation>;
  @Input() pageNumber = 1;
  @Input() showSidebarToggleBtn: boolean;
  @Input() showSearchbarToggleBtn: boolean;
  @Input() showHighlightBtn: boolean;
  @Input() showNavigationBtns: boolean;
  @Input() sidebarOpen: BehaviorSubject<boolean>;
  @Input() searchBarHidden: BehaviorSubject<boolean>;
  constructor(readonly toolbarEventsService: ToolbarEventsService) {}
  // Handler onClick Event of the Highlight Mode Button
  onClickHighlightToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEventsService.toggleHighlightMode();
  }
  // Handler onClick Event of the Draw Mode Button
  onClickDrawToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEventsService.toggleDrawMode();
  }

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
}
