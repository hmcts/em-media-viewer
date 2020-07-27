import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolbarEventService } from '../toolbar-event.service';
import { select, Store } from '@ngrx/store';
import * as fromRedactSelectors from '../../store/selectors/redaction.selectors';
import * as fromStore from '../../store/reducers/reducers';
import { Subscription } from 'rxjs';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';

@Component({
  selector: 'mv-redaction-toolbar',
  templateUrl: './redaction-toolbar.component.html'
})
export class RedactionToolbarComponent implements OnInit, OnDestroy {

  preview = false;
  hasRedactions = false;
  $subscription: Subscription;

  constructor(public readonly toolbarEventService: ToolbarEventService,
              public readonly toolbarButtons: ToolbarButtonVisibilityService,
              private store: Store<fromStore.AnnotationSetState>) {}

  ngOnInit(): void {
    this.$subscription = this.store.pipe(select(fromRedactSelectors.getRedactionArray)).subscribe(redactions => {
      this.hasRedactions = !!redactions.redactions.length;
    });
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
