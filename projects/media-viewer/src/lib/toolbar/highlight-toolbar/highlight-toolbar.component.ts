import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SearchMode, SearchType, ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarFocusService } from '../toolbar-focus.service';
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
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    private readonly toolbarFocusService: ToolbarFocusService
  ) { }

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

  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.closeAndReturnFocus();
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const highlightToolbar = target.closest('.redaction');
    if (highlightToolbar) {
      this.returnFocusToMainToolbar();
    }
  }

  private closeAndReturnFocus() {
    this.onClose();
    this.returnFocusToMainToolbar();
  }

  private returnFocusToMainToolbar() {
      this.toolbarFocusService.focusToolbarButton('#mvHighlightBtn');
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
