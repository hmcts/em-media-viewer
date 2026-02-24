import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchType, ToolbarEventService } from '../toolbar-event.service';
import { select, Store } from '@ngrx/store';
import * as fromRedactSelectors from '../../store/selectors/redaction.selectors';
import * as fromStore from '../../store/reducers/reducers';
import { Subscription } from 'rxjs';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarFocusService } from '../toolbar-focus.service';


@Component({
    selector: 'mv-redaction-toolbar',
    templateUrl: './redaction-toolbar.component.html',
    standalone: false
})
export class RedactionToolbarComponent implements OnInit, OnDestroy {

  @Input() showRedactSearch: boolean;

  preview = false;
  hasRedactions = false;

  private subscriptions: Subscription[] = [];
  redactionAllInProgress: boolean;

  constructor(public readonly toolbarEventService: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    private store: Store<fromStore.AnnotationSetState>,
    private readonly toolbarFocusService: ToolbarFocusService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.store.pipe(select(fromRedactSelectors.getRedactionArray)).subscribe(redactions => {
      this.hasRedactions = !!redactions.redactions.length;
    }));
    this.subscriptions.push(this.toolbarEventService.redactAllInProgressSubject.subscribe(inprogress => {
      this.redactionAllInProgress = inprogress;
    }));
  }

  onRedactAllSearch() {
    this.toolbarEventService.openRedactionSearch.next({ modeType: SearchType.Redact, isOpen: true });
  }

  toggleTextRedactionMode() {
    this.toolbarEventService.highlightModeSubject.next(true);
  }

  toggleDrawMode() {
    this.toolbarEventService.drawModeSubject.next(true);
  }

  togglePreview() {
    this.preview = !this.preview;
    this.toolbarEventService.toggleRedactionPreview(this.preview);
  }

  unmarkAll() {
    this.toolbarEventService.unmarkAll();
  }

  redact() {
    this.toolbarEventService.applyRedactionToDocument();
  }

  toggleRedactBar() {
    this.toolbarEventService.toggleRedactionMode();
  }

  redactPage() {
    this.toolbarEventService.drawModeSubject.next(true);
    this.toolbarEventService.redactPage();
  }

  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleRedactBar();
    this.returnFocusToMainToolbar();
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const redactionToolbar = target.closest('.redaction');
    if (redactionToolbar) {
      this.returnFocusToMainToolbar();
    }
  }

  private returnFocusToMainToolbar() {
    this.toolbarFocusService.focusToolbarButton('#mvRedactBtn');
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
