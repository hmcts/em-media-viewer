import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';
import * as fromStore from '../../store/reducers';
import * as fromSelectors from '../../store/selectors/redaction.selectors';
import * as fromAnnotations from '../../store/selectors/annotations.selectors';
import * as fromActions from '../../store/actions/redaction.actions';
import * as fromRedactionActions from '../../store/actions/redaction.actions';
import { SelectionAnnotation } from '../../annotations/models/event-select.model';
import uuid from 'uuid';
import { map, take } from 'rxjs/operators';
import { ToolbarEventService } from '../../toolbar/toolbar.module';

@Component({
  selector: 'mv-redactions',
  templateUrl: './redaction.component.html'
})
export class RedactionComponent implements OnInit, OnDestroy {

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
    this.$subscription = this.toolbarEvents.drawModeSubject
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
    this.toolbarEvents.drawModeSubject.next(false);
  }

  public onMarkerUpdate(redaction: any) {
    this.store.dispatch(new fromActions.SaveReduction(redaction));
  }
}
