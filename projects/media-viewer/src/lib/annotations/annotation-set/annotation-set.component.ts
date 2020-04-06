import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Annotation } from './annotation-view/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { Observable, Subscription } from 'rxjs';
import { SelectionAnnotation } from '../models/event-select.model';
import { CommentService } from '../comment-set/comment/comment.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers';
import * as fromActions from '../../store/actions/annotations.action';
import * as fromSelectors from '../../store/selectors/annotations.selectors';

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

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly api: AnnotationApiService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly commentService: CommentService) {}

  ngOnInit(): void {
    this.annotationsPerPage$ = this.store.select(fromSelectors.getAnnoPerPage);
    this.selectedAnnotation$ = this.store.select(fromSelectors.getSelectedAnnotation);

    this.subscriptions = [
      this.toolbarEvents.drawModeSubject
        .subscribe(drawMode => this.drawMode = drawMode)
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
