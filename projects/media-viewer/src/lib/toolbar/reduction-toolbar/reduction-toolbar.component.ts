import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ToolbarEventService} from '../toolbar-event.service';
import {select, Store} from '@ngrx/store';
import * as fromRedaSelectors from '../../store/selectors/reductions.selectors';
import {take} from 'rxjs/operators';
import * as fromRedaActions from '../../store/actions/reduction.actions';
import * as fromStore from '../../store/reducers';
import {Subscription} from 'rxjs';

@Component({
  selector: 'mv-reduction-toolbar',
  templateUrl: './reduction-toolbar.component.html'
})
export class ReductionToolbarComponent implements OnInit, OnDestroy {
  preview = false;
  hasRedactions = false;
  $ubsctiption: Subscription;
  constructor(
    public readonly toolbarEvents: ToolbarEventService,
    public readonly toolbarEventService: ToolbarEventService,
    private store: Store<fromStore.AnnotationSetState>
  ) {}

  ngOnInit(): void {
    this.$ubsctiption = this.store.pipe(select(fromRedaSelectors.getRedactionArray)).subscribe(redactions => {
      this.hasRedactions = !!redactions.redactions.length;
    });
  }

  toggleTextReductionMode() {
    this.toolbarEventService.highlightTextReductionMode.next(true);
  }

  togglePreview() {
    this.preview = !this.preview;
    this.toolbarEventService.toggleRedactionPreview(this.preview);
  }

  unmarkAll() {
    this.toolbarEventService.unmarkAll();
  }

  reduce() {
    this.toolbarEventService.reduce();
  }

  ngOnDestroy(): void {
    this.$ubsctiption.unsubscribe();
  }
}
