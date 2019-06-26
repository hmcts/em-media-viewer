import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../shared/viewer-operations';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {ToolbarEventsService} from '../../shared/toolbar-events.service';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarLeftPaneComponent implements OnInit, OnDestroy {
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
  // Local presentation state that can be pre-initialised from the template
  @Input() highlightMode = false;
  @Input() drawMode = false;

  // local array of any subscriptions so that we can tidy them up later
  private subscriptions: Subscription[] = [];
  constructor(private readonly toolbarEventsService: ToolbarEventsService) {}

  ngOnInit(): void {
    // Listen for any changes invoked on the toolbar events Service and initialise any default behaviour state
    this.subscriptions.push(this.toolbarEventsService.highlightMode.subscribe((toggleValue) => {
      this.highlightMode = toggleValue;
    }));
    this.subscriptions.push(this.toolbarEventsService.drawMode.subscribe((toggleValue) => {
      this.drawMode = toggleValue;
    }));
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions that we may have
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

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
