import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {select, Store} from '@ngrx/store';
import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';
import * as fromStore from '../../store/reducers';
import * as fromSelectors from '../../store/selectors/reductions.selectors';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'mv-reductions',
  templateUrl: './reductions.component.html'
})
export class ReductionsComponent implements OnInit, OnDestroy {

  reductionsPerPage$: Observable<any>; // todo add type
  selectedAnnotation$
  @Input() zoom: number;
  @Input() rotate: number;
  highlightPage: number;
  rectangles: Rectangle[];

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromStore.State>) {}

  ngOnInit(): void {
    this.reductionsPerPage$ = this.store.pipe(select(fromSelectors.getAnnoPerPage), tap(console.log));

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onMarkerDelete(event) {}

  selectReduction(event) {}

  createHighlight() {
    // this.highlightService.saveAnnotation(this.rectangles, this.highlightPage);
    // this.highlightService.resetHighlight();
    this.rectangles = undefined;
  }

}
