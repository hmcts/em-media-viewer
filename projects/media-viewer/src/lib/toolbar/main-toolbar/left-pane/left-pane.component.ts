import { Component, Input } from '@angular/core';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../../shared/viewer-operations';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToolbarEventService } from '../../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../../../styles/main.scss']
})
export class ToolbarLeftPaneComponent {
  // Input Properties
  @Input() changePageByDelta: Subject<ChangePageByDeltaOperation>;
  @Input() setCurrentPage: Subject<SetCurrentPageOperation>;
  @Input() pageNumber = 1;

  constructor(
    public readonly toolbarEventsService: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}

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
    this.toolbarButtons.sidebarOpen.next(!this.toolbarButtons.sidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.toolbarButtons.searchBarHidden.next(!this.toolbarButtons.searchBarHidden.getValue());
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
