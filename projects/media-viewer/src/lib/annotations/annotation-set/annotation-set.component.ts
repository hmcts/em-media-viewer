import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList, SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { Annotation } from './annotation-view/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { Observable, Subscription } from 'rxjs';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { AnnotationEventService, SelectionAnnotation } from '../annotation-event.service';
import { CommentService } from '../comment-set/comment/comment.service';
import { TextHighlightCreateService } from './annotation-create/text-highlight-create.service';
import { BoxHighlightCreateService } from './annotation-create/box-highlight-create.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import {tap} from 'rxjs/operators';
import {BoxHighlightCreateComponent} from './annotation-create/box-highlight-create.component';

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
    private readonly annotationService: AnnotationEventService,
    private readonly commentService: CommentService,
    private readonly boxHighlightService: BoxHighlightCreateService,
    private readonly textHighlightService: TextHighlightCreateService) {}

  ngOnInit(): void {
    this.annotationsPerPage$ = this.store.select(fromStore.getAnnoPerPage);
    this.selectedAnnotation$ = this.store.select(fromStore.getSelectedAnnotation);

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

  addToDOM(eventSource: PageEvent['source']) {
    // this.zoom = eventSource.scale;
    // this.rotate = eventSource.rotation;
    // const element = eventSource.div;
    // this.width = this.rotate % 180 === 0 ? element.clientWidth : element.clientHeight;
    // this.height = this.rotate % 180 === 0 ? element.clientHeight : element.clientWidth;
    // element.appendChild(this.container.nativeElement);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.store.dispatch(new fromStore.SaveAnnotation(annotation));
  }

  public onAnnotationDelete(annotation: Annotation) {
    if (annotation.comments.length > 0) {
      this.commentService.updateUnsavedCommentsStatus(annotation, false);
    }
    this.store.dispatch(new fromStore.DeleteAnnotation(annotation.id));
  }

  public onMouseDown(event: MouseEvent) {
    if (this.annoSet && this.drawMode) {
      this.boxHighlightService.initBoxHighlight(event);
    }
  }

  public onMouseMove(event: MouseEvent) {
    if (this.annoSet && this.drawMode) {
      this.boxHighlightService.updateBoxHighlight(event);
    }
  }

  public onMouseUp(page) {
    this.page = page;
    if (this.annoSet && this.drawMode) {
      this.boxHighlight.createHighlight(this.page);
    }
  }
  // todo revisit this multiple acctions are getting issues
  public saveBoxHighlight(rectangle: any) {
    if (rectangle.page === this.page) {
      // this.annotationService.selectAnnotation(rectangle.id);
      this.boxHighlightService.saveBoxHighlight(rectangle, this.annoSet, rectangle.page);
    }
  }

  private createTextHighlight(highlight) {
    // if (this.height && this.width) {
      this.textHighlightService.createTextHighlight(highlight, highlight.annoSet,
        {
          zoom: this.zoom,
          rotate: this.rotate,
          pageHeight: this.height,
          pageWidth: this.width,
          number: highlight.page
        });
    // }
  }

  selectAnnotation(annotationId) {
    this.store.dispatch(new fromStore.SelectedAnnotation(annotationId))
    // this.annotationService.selectAnnotation(annotationId);
  }

  annotationSetClass() {
    return [
      // 'rotation rot' + this.rotate,
      // this.drawMode ? 'drawMode' : ''
    ];
  }

  toggleCommentsSummary() {
    this.toolbarEvents.toggleCommentsSummary(!this.toolbarEvents.showCommentSummary.getValue());
  }
}
