import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {select, Store} from '@ngrx/store';
import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';
import * as fromStore from '../../store/reducers';
import * as fromSelectors from '../../store/selectors/reductions.selectors';
import * as fromAnnotations from '../../store/selectors/annotations.selectors';
import * as fromActions from '../../store/actions/reduction.actions';
import {SelectionAnnotation} from '../../annotations/models/event-select.model';
import uuid from 'uuid';
import * as fromRedactionActions from '../../store/actions/reduction.actions';
import { map, take } from 'rxjs/operators';
import { ToolbarEventService } from '../../toolbar/toolbar.module';

@Component({
  selector: 'mv-reductions',
  templateUrl: './reductions.component.html'
})
export class ReductionsComponent implements OnInit, OnDestroy {

  @Input() zoom: number;
  @Input() rotate: number;

  reductionsPerPage$: Observable<any>; // todo add type
  selectedRedaction$: Observable<SelectionAnnotation | {}>;
  rectangles: Rectangle[];
  drawMode: boolean;

  private $subscription: Subscription;

  constructor(private store: Store<fromStore.State>,
              private toolbarEvents: ToolbarEventService) {}

  ngOnInit(): void {
    this.reductionsPerPage$ = this.store.pipe(select(fromSelectors.getAnnoPerPage));
    this.selectedRedaction$ = this.store.pipe(select(fromSelectors.getSelected));
    this.$subscription = this.toolbarEvents.redactionDrawModeSubject
      .subscribe(drawMode => this.drawMode = drawMode);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  onMarkerDelete(event) {
    this.store.dispatch(new  fromActions.DeleteReduction(event));
  }

  selectReduction(event) {
    this.store.dispatch(new fromActions.SelectRedaction(event));
  }

  saveRedaction({ rectangles, page }) {
    this.store.pipe(
      select(fromAnnotations.getDocumentIdSetId),
      take(1),
      map(docSetId => docSetId.documentId)
    ).subscribe(documentId => {
      const redactionId = uuid();
      const redaction = {page, rectangles, redactionId, documentId};
      this.store.dispatch(new fromRedactionActions.SaveReduction(redaction));
    });
  }
}
