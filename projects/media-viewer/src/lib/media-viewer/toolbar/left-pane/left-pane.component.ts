import { Component, Input } from '@angular/core';
import {BehaviorSubject, Subject,} from 'rxjs';
import {ActionEvents, ChangeByDelta, ChangePageOperation, SetCurrentPage} from '../../media-viewer.model';

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
    this.actionEvents.changePage.next(new ChangePageOperation(new ChangeByDelta(1)));
  }

  decreasePageNumber() {
    this.actionEvents.changePage.next(new ChangePageOperation(new ChangeByDelta(-1)));
  }

  setCurrentPageNumber(pageNumber: string) {
    this.actionEvents.changePage.next(new ChangePageOperation(new SetCurrentPage(Number.parseInt(pageNumber, 0))));
  }

  @Input()
  set stateChange(stateChangeEvent: ChangePageOperation | any) {
    console.log(stateChangeEvent);
    if (stateChangeEvent instanceof ChangePageOperation) {
      if (stateChangeEvent.changePageParameter instanceof SetCurrentPage) {
        this.pageNumber = stateChangeEvent.changePageParameter.pageNumber;
      }
    }
  }

}
