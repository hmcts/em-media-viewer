import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchMode, SearchType, ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import * as fromStore from '../../store/reducers/reducers';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromRedactSelectors from '../../store/selectors/redaction.selectors';

@Component({
    selector: 'mv-highlight-toolbar',
    templateUrl: './highlight-toolbar.component.html',
    styleUrls: ['./highlight-toolbar.component.scss'],
    standalone: false
})
export class HighlightToolbarComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  redactionAllInProgress: boolean;

  constructor(public readonly toolbarEventService: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.toolbarEventService.redactAllInProgressSubject.subscribe(inprogress => {
      this.redactionAllInProgress = inprogress;
    }));
  }

  onAllSearch() {
    this.toolbarEventService.openRedactionSearch.next({ modeType: SearchType.Highlight, isOpen: true } as SearchMode);
  }

  onHighlight() {
    this.toolbarEventService.toggleHighlightMode();
  }

  onClickDrawToggle() {
    this.toolbarEventService.toggleDrawMode();
  }

  onClose() {
    this.toolbarEventService.highlightToolbarSubject.next(false);
    this.toolbarEventService.highlightModeSubject.next(false);
    this.toolbarEventService.openRedactionSearch.next({ modeType: SearchType.Highlight, isOpen: false } as SearchMode);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
