import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';
import * as fromStore from '../../store/reducers/reducers';
import * as fromSelectors from '../../store/selectors/redaction.selectors';
import * as fromRedaSelectors from '../../store/selectors/redaction.selectors';
import * as fromDocument from '../../store/selectors/document.selectors';
import * as fromActions from '../../store/actions/redaction.actions';
import * as fromRedactionActions from '../../store/actions/redaction.actions';
import * as fromRedaActions from '../../store/actions/redaction.actions';
import { SelectionAnnotation } from '../../annotations/models/event-select.model';
import uuid from 'uuid';
import { filter, take } from 'rxjs/operators';
import { ToolbarEventService } from '../../toolbar/toolbar.module';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { HighlightCreateService } from '../../annotations/annotation-set/annotation-create/highlight-create.service';

@Component({
  selector: 'mv-redactions',
  templateUrl: './redaction.component.html'
})
export class RedactionComponent implements OnInit, OnDestroy {

  @Input() zoom: number;
  @Input() rotate: number;

  redactionsPerPage$: Observable<any>; // todo add type
  selectedRedaction$: Observable<SelectionAnnotation | {}>;
  rectangles: Rectangle[];
  drawMode: boolean;
  documentId: string;

  private $subscription: Subscription;

  constructor(private store: Store<fromStore.State>,
              private readonly viewerEvents: ViewerEventService,
              private readonly highlightService: HighlightCreateService,
              private toolbarEvents: ToolbarEventService) {}

  ngOnInit(): void {
    this.redactionsPerPage$ = this.store.pipe(select(fromSelectors.getAnnoPerPage));
    this.selectedRedaction$ = this.store.pipe(select(fromSelectors.getSelected));
    this.$subscription = this.toolbarEvents.drawModeSubject.subscribe(drawMode => this.drawMode = drawMode);
    this.$subscription.add(this.store.pipe(select(fromSelectors.getRedactedDocumentInfo), filter(value => !!value))
          .subscribe(redactedDocInfo => this.downloadDocument(redactedDocInfo)));
    this.$subscription.add(this.store.pipe(select(fromDocument.getDocumentId)).subscribe(docId => this.documentId = docId));
    this.$subscription.add(this.viewerEvents.textHighlight.subscribe(highlight => this.markTextRedaction(highlight)));
    this.toolbarEvents.applyRedactToDocument.subscribe(() => {
      this.store.pipe(select(fromRedaSelectors.getRedactionArray), take(1)).subscribe(redactions => {
        this.store.dispatch(new fromRedaActions.Redact(redactions));
      });
    });
    this.toolbarEvents.clearAllRedactMarkers.subscribe(() => {
      this.store.dispatch(new fromRedaActions.UnmarkAll(this.documentId));
    });
  }

  markTextRedaction(highlight) {
    const redactionHighlight = this.highlightService.getRectangles(highlight.event);
    const redactionId = uuid();
    if (redactionHighlight && redactionHighlight.length) {
      const documentId = this.documentId;
      const redaction = { page: highlight.page, rectangles: [...redactionHighlight], redactionId, documentId};
      this.store.dispatch(new fromRedactionActions.SaveRedaction(redaction));
    }
    this.toolbarEvents.highlightModeSubject.next(false);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  onMarkerDelete(event) {
    this.store.dispatch(new  fromActions.DeleteRedaction(event));
  }

  selectRedaction(event) {
    this.store.dispatch(new fromActions.SelectRedaction(event));
  }

  saveRedaction({ rectangles, page }) {
    const redaction = { page, rectangles, redactionId: uuid(), documentId: this.documentId };
    this.store.dispatch(new fromRedactionActions.SaveRedaction(redaction));
    this.toolbarEvents.drawModeSubject.next(false);
  }

  public onMarkerUpdate(redaction: any) {
    this.store.dispatch(new fromActions.SaveRedaction(redaction));
  }

  downloadDocument({ url, filename }) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
    this.store.dispatch(new fromRedactionActions.ClearRedactDocUrl());
  }
}
