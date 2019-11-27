import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { Annotation } from '../annotation-set/annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { Comment } from './comment/comment.model';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { CommentComponent } from './comment/comment.component';
import { AnnotationService, SelectionAnnotation } from '../annotation.service';
import { Subscription } from 'rxjs';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { CommentSetRenderService } from './comment-set-render.service';

@Component({
  selector: 'mv-comment-set',
  templateUrl: './comment-set.component.html',
  styleUrls: ['./comment-set.component.scss']
})
export class CommentSetComponent implements OnInit, OnDestroy {

  @Input() annotationSet: AnnotationSet;
  @Input() page: number;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() height: number;

  comments: Comment[];
  selectAnnotation: SelectionAnnotation;
  private subscriptions: Subscription[] = [];
  pageContainer;
  pageWrapper;

  @ViewChild('container') container: ElementRef;
  @ViewChildren('commentComponent') commentComponents: QueryList<CommentComponent>;

  showCommentsPanel: boolean;

  constructor(private readonly viewerEvents: ViewerEventService,
              private readonly api: AnnotationApiService,
              private readonly annotationService: AnnotationService,
              private readonly commentSetService: CommentSetRenderService) {
    this.clearSelection();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.annotationService.getSelectedAnnotation()
        .subscribe((selectedAnnotation) => this.selectAnnotation = selectedAnnotation),
      this.viewerEvents.commentsPanelToggle.subscribe(toggle => this.showCommentsPanel = toggle)
    );
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    if (this.pageContainer) {
      this.pageContainer.remove();
    }
    if (this.pageWrapper) {
      this.pageWrapper.remove();
    }
  }

  addToDOM(eventSource: PageEvent['source']) {
    this.setCommentSetValues(eventSource);
    const element = eventSource.div;

    if (!this.pageContainer) {
      const pageWrapper =  document.createElement('div');
      pageWrapper.setAttribute('class', 'pageWrapper');

      const pageContainer =  document.createElement('div');
      pageContainer.setAttribute('class', 'pageContainer');
      element.insertAdjacentElement('beforebegin', pageContainer);
      pageWrapper.appendChild(element);
      pageContainer.appendChild(pageWrapper);

      this.pageContainer = pageContainer;
      this.pageWrapper = pageWrapper;
    }
    this.pageContainer.appendChild(this.container.nativeElement);
  }

  setCommentSetValues(eventSource: PageEvent['source']) {
    this.height = eventSource.div.clientHeight;
    this.zoom = eventSource.scale;
    this.rotate = eventSource.rotation;
  }

  public getCommentsOnPage(): Annotation[] {
    if (this.annotationSet) {
      return this.annotationSet.annotations.filter(a => a.page === this.page);
    }
  }

  public onSelect(annotationId) {
    this.annotationService.onAnnotationSelection(annotationId);
  }

  public onCommentDelete(comment: Comment) {
    const annotation = this.annotationSet.annotations.find(anno => anno.id === comment.annotationId);
    annotation.comments = [];
    this.onAnnotationUpdate(annotation);
    this.redrawComments();
  }

  redrawComments() {
    setTimeout(() => {
      const componentList: CommentComponent[] = this.commentComponents.map(comment => comment);
      this.commentSetService.redrawComponents(componentList, this.height, this.rotate, this.zoom);
    });
  }

  public onCommentUpdate(comment: Comment) {
    const annotation = this.annotationSet.annotations.find(anno => anno.id === comment.annotationId);
    annotation.comments[0] = comment;
    this.onAnnotationUpdate(annotation);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.api
      .postAnnotation(annotation)
      .subscribe(newAnnotation => {
        const index = this.annotationSet.annotations.findIndex(a => a.id === newAnnotation.id);

        this.annotationSet.annotations[index] = newAnnotation;
      });
    this.annotationService.onAnnotationSelection({ annotationId: annotation.id, editable: false });
  }

  topRectangle(annotationId: string) {
    const annotation = this.annotationSet.annotations.find((annotation) => annotation.id === annotationId);
    return annotation.rectangles.reduce((prev, current) => prev.y < current.y ? prev : current);
  }

  onContainerClick(e) {
    if (e.path && e.path[0] === this.container.nativeElement) {
      this.clearSelection();
    }
  }

  clearSelection() {
    this.selectAnnotation = { annotationId: '', editable: false };
  }
}
