import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Annotation } from './annotation-view/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { Observable, Subscription } from 'rxjs';
import { SelectionAnnotation } from '../models/event-select.model';
import { CommentService } from '../comment-set/comment/comment.service';
import { TextHighlightCreateService } from './annotation-create/text-highlight-create.service';
import { BoxHighlightCreateService } from './annotation-create/box-highlight-create.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers/annotatons.reducer';
import * as fromActions from '../../store/actions/annotations.action';
import * as fromSelectors from '../../store/selectors/annotatioins.selectors';
import { BoxHighlightCreateComponent } from './annotation-create/box-highlight-create.component';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'mv-annotation-set',
  templateUrl: './annotation-set.component.html'
})
export class AnnotationSetComponent implements OnInit, OnDestroy {
  annoSet: AnnotationSet;
  annotationsPerPage$: Observable<any>; // todo add type
  @Input() set annotationSet(annoSet) {
    if (annoSet) {
      this.annoSet = {...annoSet};
    }
  }
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() width: number;
  @Input() height: number;
  @ViewChild('boxHighlight') private boxHighlight: BoxHighlightCreateComponent;
  page: number;
  selectedAnnotation$: Observable<SelectionAnnotation>;
  drawMode = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly api: AnnotationApiService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly commentService: CommentService,
    private readonly boxHighlightService: BoxHighlightCreateService,
    private readonly textHighlightService: TextHighlightCreateService) {}

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
        .subscribe(highlight => this.createTextHighlight(highlight)),
      this.viewerEvents.boxHighlight
        .subscribe(highlight => this.boxHighlightService.initBoxHighlight(highlight.event)),
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

  public onInitBoxHighlight(event: MouseEvent) {
    if (this.annoSet && this.drawMode) {
      this.boxHighlightService.initBoxHighlight(event);
    }
  }

  public onMouseMove(event: MouseEvent) {
    if (this.annoSet && this.drawMode) {
      this.boxHighlightService.updateBoxHighlight(event);
    }
  }

  public onCreateBoxHighlight(page) {
    this.page = page;
    if (this.annoSet && this.drawMode) {
      this.boxHighlight.createHighlight(this.page);
    }
  }


  public saveBoxHighlight(rectangle: any) {
    if (rectangle.page === this.page) {
      this.boxHighlightService.saveBoxHighlight(rectangle, this.annoSet, rectangle.page);
    }
  }

  private createTextHighlight(highlight) {
      this.textHighlightService.createTextHighlight(highlight, highlight.annoSet,
        {
          zoom: this.zoom,
          rotate: this.rotate,
          pageHeight: this.height,
          pageWidth: this.width,
          number: highlight.page
        });
  }

  selectAnnotation(annotationId) {
    this.store.dispatch(new fromActions.SelectedAnnotation(annotationId));
  }

  toggleCommentsSummary() {
    this.toolbarEvents.toggleCommentsSummary(!this.toolbarEvents.showCommentSummary.getValue());
  }
}
