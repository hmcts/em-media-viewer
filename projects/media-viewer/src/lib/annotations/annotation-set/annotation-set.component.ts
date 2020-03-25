import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Annotation } from './annotation-view/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Highlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { Observable, Subscription } from 'rxjs';
import { SelectionAnnotation } from '../models/event-select.model';
import { CommentService } from '../comment-set/comment/comment.service';
import { HighlightCreateService } from './annotation-create/highlight-create.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers';
import * as fromActions from '../../store/actions/annotations.action';
import * as fromSelectors from '../../store/selectors/annotatioins.selectors';
import { BoxHighlightCreateComponent } from './annotation-create/box-highlight-create.component';
import { tap } from 'rxjs/operators';
import { Rectangle } from './annotation-view/rectangle/rectangle.model';
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
  rectangles: Rectangle[];
  popupPage: number;

  private subscriptions: Subscription[] = [];
  rectangle: Rectangle;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly api: AnnotationApiService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly commentService: CommentService,
    private readonly highlightService: HighlightCreateService) {}

  ngOnInit(): void {
    this.annotationsPerPage$ = this.store.select(fromSelectors.getAnnoPerPage)
      .pipe(tap(annotations => {
        if (annotations) {
          this.height = annotations[0].styles.height;
          this.width = annotations[0].styles.width;
        }
    }));
    this.selectedAnnotation$ = this.store.select(fromSelectors.getSelectedAnnotation);

    this.subscriptions = [
      this.viewerEvents.textHighlight
        .subscribe(highlight => this.onTextHighlight(highlight)),
      this.toolbarEvents.drawModeSubject
        .subscribe(drawMode => this.drawMode = drawMode)
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private onTextHighlight(highlight: Highlight) {
    if (highlight) {
      this.popupPage = highlight.page;
      this.rectangles = this.highlightService.getRectangles(highlight, {
        zoom: this.zoom,
        rotate: this.rotate,
        height: this.height,
        width: this.width
      });
      if (this.rectangles) {
        this.rectangle = this.rectangles
          .reduce((prev, current) => prev.y < current.y ? prev : current);
      }
    }
  }

  createHighlight() {
    this.highlightService.saveAnnotation(this.rectangles, this.annoSet.id, this.popupPage);
    this.highlightService.resetHighlight();
    this.rectangle = undefined;
    this.rectangles = undefined
  }

  createBookmark() {
    const selection = window.getSelection().toString();
    this.viewerEvents.createBookmarkEvent.next({
      name: selection.length > 0 ? selection : 'new bookmark',
      pageNumber: new String(this.popupPage - 1).toString(),
      xCoordinate: this.width - this.rectangle.x,
      yCoordinate: this.height - this.rectangle.y
    });
    this.highlightService.resetHighlight();
    this.rectangle = undefined;
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

  selectAnnotation(annotationId) {
    this.store.dispatch(new fromActions.SelectedAnnotation(annotationId))
  }
}
