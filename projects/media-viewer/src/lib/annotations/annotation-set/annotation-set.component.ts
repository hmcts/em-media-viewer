import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Annotation } from './annotation-view/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { AnnotationEventService, SelectionAnnotation } from '../annotation-event.service';
import { CommentService } from '../comment-set/comment/comment.service';
import { TextHighlightCreateService } from './annotation-create/text-highlight-create.service';
import { BoxHighlightCreateService } from './annotation-create/box-highlight-create.service';

@Component({
  selector: 'mv-annotation-set',
  templateUrl: './annotation-set.component.html'
})
export class AnnotationSetComponent implements OnInit, OnDestroy {

  @Input() annotationSet: AnnotationSet;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() width: number;
  @Input() height: number;
  @Input() page: number;

  @ViewChild('container') container: ElementRef;

  selectedAnnotation: SelectionAnnotation = { annotationId: '', editable: false };
  drawMode = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly api: AnnotationApiService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly annotationService: AnnotationEventService,
    private readonly commentService: CommentService,
    private readonly boxHighlightService: BoxHighlightCreateService,
    private readonly textHighlightService: TextHighlightCreateService) {}

  ngOnInit(): void {
    this.subscriptions = [
      this.viewerEvents.textHighlight
        .subscribe(highlight => this.createTextHighlight(highlight)),
      this.viewerEvents.boxHighlight
        .subscribe(highlight => this.boxHighlightService.initBoxHighlight(highlight.event)),
      this.annotationService.getSelectedAnnotation()
        .subscribe(selectedAnnotation => this.selectedAnnotation = selectedAnnotation),
      this.toolbarEvents.drawModeSubject
        .subscribe(drawMode => this.drawMode = drawMode)
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  addToDOM(eventSource: PageEvent['source']) {
    this.zoom = eventSource.scale;
    this.rotate = eventSource.rotation;
    const element = eventSource.div;
    this.width = this.rotate % 180 === 0 ? element.clientWidth : element.clientHeight;
    this.height = this.rotate % 180 === 0 ? element.clientHeight : element.clientWidth;
    element.appendChild(this.container.nativeElement);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.api
      .postAnnotation(annotation)
      .subscribe(newAnnotation => {
        const unsavedComment = this.commentService.hasUnsavedComments(annotation);
        const index = this.annotationSet.annotations.findIndex(a => a.id === newAnnotation.id);

        this.annotationSet.annotations[index] = unsavedComment ? annotation : newAnnotation;
        this.selectAnnotation({ annotationId: annotation.id, editable: false });
      });
  }

  public onAnnotationDelete(annotation: Annotation) {
    if (annotation.comments.length > 0) {
      this.commentService.updateUnsavedCommentsStatus(annotation, false);
    }
    this.api
      .deleteAnnotation(annotation.id)
      .subscribe(() => {
        this.annotationSet.annotations = this.annotationSet.annotations.filter(a => a.id !== annotation.id);
        this.selectAnnotation({ annotationId: '', editable: false });
      });
  }

  public onMouseDown(event: MouseEvent) {
    if (this.annotationSet && this.drawMode) {
      this.boxHighlightService.initBoxHighlight(event);
    }
  }

  public onMouseMove(event: MouseEvent) {
    if (this.annotationSet && this.drawMode) {
      this.boxHighlightService.updateBoxHighlight(event);
    }
  }

  public onMouseUp() {
    if (this.annotationSet && this.drawMode) {
      this.boxHighlightService.createBoxHighlight(this.page);
    }
  }

  public saveBoxHighlight(rectangle: any) {
    if (rectangle.page === this.page) {
      this.boxHighlightService.saveBoxHighlight(rectangle, this.annotationSet, rectangle.page);
    }
  }

  private createTextHighlight(highlight) {
    this.textHighlightService.createTextHighlight(highlight, this.annotationSet,
        {
          zoom: this.zoom,
          rotate: this.rotate,
          pageHeight: this.height,
          pageWidth: this.width,
          number: highlight.page
        });
  }

  selectAnnotation(annotationId) {
    this.annotationService.selectAnnotation(annotationId);
  }

  public getAnnotationsOnPage(): Annotation[] {
    if (this.annotationSet) {
      return this.annotationSet.annotations.filter(a => a.page === this.page);
    }
  }


  public containerRectangle() {
    return this.container.nativeElement.getBoundingClientRect();
  }

  annotationSetClass() {
    return [
      'rotation rot' + this.rotate,
      this.drawMode ? 'drawMode' : ''
    ];
  }
}
