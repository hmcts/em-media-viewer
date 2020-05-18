import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
})
export class ToolbarLeftPaneComponent implements OnInit, OnDestroy {
  public pageNumber = 1;
  private subscriptions: Subscription[] = [];

  constructor(
    public readonly toolbarEvents: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.setCurrentPageSubject.subscribe(pageNumber => this.pageNumber = pageNumber),
      this.toolbarEvents.setCurrentPageInputValueSubject.subscribe(pageNumber => this.pageNumber = pageNumber)
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // Handler onClick Event of the Highlight Mode Button
  onClickHighlightToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEvents.toggleHighlightMode();
  }
  // Handler onClick Event of the Draw Mode Button
  onClickDrawToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEvents.toggleDrawMode();
  }

  toggleSideBar() {
    this.toolbarEvents.sidebarOpen.next(!this.toolbarEvents.sidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.toolbarEvents.searchBarHidden.next(!this.toolbarEvents.searchBarHidden.getValue());
  }

  increasePageNumber() {
    this.toolbarEvents.incrementPage(1);
  }

  decreasePageNumber() {
    this.toolbarEvents.incrementPage(-1);
  }

  onPageNumberInputChange(pageNumber: string) {
    this.toolbarEvents.setPage(Number.parseInt(pageNumber, 0));
  }
}
