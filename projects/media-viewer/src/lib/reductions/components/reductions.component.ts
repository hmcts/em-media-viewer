import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {select, Store} from '@ngrx/store';
import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';
import * as fromStore from '../../store/reducers';
import * as fromSelectors from '../../store/selectors/reductions.selectors';
import * as fromActions from '../../store/actions/reduction.actions';
import {SelectionAnnotation} from '../../annotations/models/event-select.model';

@Component({
  selector: 'mv-reductions',
  templateUrl: './reductions.component.html'
})
export class ReductionsComponent implements OnInit, OnDestroy {

  reductionsPerPage$: Observable<any>; // todo add type
  selectedRedaction$: Observable<SelectionAnnotation | {}>;
  @Input() zoom: number;
  @Input() rotate: number;
  rectangles: Rectangle[];

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromStore.State>) {}

  ngOnInit(): void {
    this.reductionsPerPage$ = this.store.pipe(select(fromSelectors.getAnnoPerPage));
    this.selectedRedaction$ = this.store.pipe(select(fromSelectors.getSelected));

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onMarkerDelete(event) {
    this.store.dispatch(new  fromActions.DeleteReduction(event));
  }

  selectReduction(event) {
    this.store.dispatch(new fromActions.SelectRedaction(event));
  }

}
