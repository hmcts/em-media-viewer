import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Annotation } from './annotation-view/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Highlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { Observable, Subscription } from 'rxjs';
import { SelectionAnnotation } from '../models/event-select.model';
import { CommentService } from '../comment-set/comment/comment.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers';
import * as fromActions from '../../store/actions/annotations.action';
import * as fromSelectors from '../../store/selectors/annotations.selectors';
import { HighlightCreateService } from './annotation-create/highlight-create.service';
import { Rectangle } from './annotation-view/rectangle/rectangle.model';
import { CreateBookmark } from '../../store/actions/bookmarks.action';
import uuid from 'uuid';

@Component({
  selector: 'mv-annotation-set',
  templateUrl: './annotation-set.component.html'
})
export class AnnotationSetComponent implements OnInit, OnDestroy {

  annoSet: AnnotationSet;
  annotationsPerPage$: Observable<any[]>; // todo add type
  @Input() set annotationSet(annoSet) {
    if (annoSet) {
      this.annoSet = {...annoSet};
    }
  }
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() width: number;
  @Input() height: number;
  selectedAnnotation$: Observable<SelectionAnnotation>;
  drawMode = false;
  highlightPage: number;
  rectangles: Rectangle[];

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly api: AnnotationApiService,
    private readonly highlightService: HighlightCreateService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly commentService: CommentService) {}

  ngOnInit(): void {
    this.annotationsPerPage$ = this.store.select(fromSelectors.getAnnoPerPage);
    this.selectedAnnotation$ = this.store.select(fromSelectors.getSelectedAnnotation);

    this.subscriptions = [
      this.toolbarEvents.drawModeSubject
        .subscribe(drawMode => this.drawMode = drawMode),
      this.viewerEvents.textHighlight
        .subscribe(highlight => this.showContextToolbar(highlight)),
      this.viewerEvents.ctxToolbarCleared
        .subscribe(() => this.clearContextToolbar())
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  showContextToolbar(highlight: Highlight) {
    this.highlightPage = highlight.page;
    this.rectangles = this.highlightService.getRectangles(highlight);
    if (this.rectangles) {
      this.toolbarEvents.highlightModeSubject.next(false);
    }
  }

  clearContextToolbar() {
    this.rectangles = undefined;
  }

  createHighlight() {
    this.highlightService.saveAnnotation(this.rectangles, this.highlightPage);
    this.highlightService.resetHighlight();
    this.rectangles = undefined;
  }

  createBookmark(rectangle: Rectangle) {
    const selection = window.getSelection().toString();
    this.store.dispatch(new CreateBookmark({
      name: selection.length > 0 ? selection.substr(0, 30) : 'new bookmark',
      pageNumber: this.highlightPage - 1,
      xCoordinate: rectangle.x,
      yCoordinate: rectangle.y,
      id: uuid(),
      documentId: null
    }));
    this.toolbarEvents.toggleSideBar(true);
    this.highlightService.resetHighlight();
    this.rectangles = undefined;
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.store.dispatch(new fromActions.SaveAnnotation(annotation));
  }

  public onAnnotationDelete(annotation: Annotation) {
    if (annotation.comments.length > 0) {
      this.commentService.updateUnsavedCommentsStatus(annotation, false);
    }
    this.store.dispatch(new fromActions.DeleteAnnotation(annotation.id));
  }

  selectAnnotation(selectedAnnotation) {
    this.store.dispatch(new fromActions.SelectedAnnotation(selectedAnnotation))
  }
}
