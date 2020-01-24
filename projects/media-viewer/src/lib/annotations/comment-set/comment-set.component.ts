import {
  Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { Annotation } from '../annotation-set/annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { Comment } from './comment/comment.model';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { CommentComponent } from './comment/comment.component';
import { AnnotationService, SelectionAnnotation } from '../annotation.service';
import { Subscription } from 'rxjs';
import { ViewerEventService } from '../../viewers/viewer-event.service';

import { CommentService } from './comment/comment.service';
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

  @ViewChild('container') container: ElementRef;
  @ViewChildren('commentComponent') commentComponents: QueryList<CommentComponent>;

  showCommentsPanel: boolean;

  constructor(private readonly viewerEvents: ViewerEventService,
              private readonly api: AnnotationApiService,
              private readonly annotationService: AnnotationService,
              private readonly commentService: CommentService,
              private readonly renderService: CommentSetRenderService) {
    this.clearSelection();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.annotationService.getSelectedAnnotation()
        .subscribe(selectedAnnotation => this.selectAnnotation = selectedAnnotation),
      this.viewerEvents.commentsPanelVisible.subscribe(toggle => {
        this.redrawComments();
        this.showCommentsPanel = toggle;
      })
    );
    this.commentService.updateCommentSets(this.page, this);
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  addToDOM(pageEvent: PageEvent) {
    this.updateView(pageEvent);
    const pageContainer = this.renderService.createPageContainer(pageEvent);
    pageContainer.appendChild(this.container.nativeElement);
  }

  updateView(pageRenderEvent: PageEvent) {
    this.height = pageRenderEvent.source.div.clientHeight;
    this.zoom = pageRenderEvent.source.scale;
    this.rotate = pageRenderEvent.source.rotation;
    this.commentService.updateCommentSets(pageRenderEvent.pageNumber, this);
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
      this.renderService.redrawComponents(componentList, this.height, this.rotate, this.zoom);
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
    const annotation = this.annotationSet.annotations.find((anno) => anno.id === annotationId);
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

  allCommentsSaved() {
    this.commentService.allCommentSetsSaved();
  }

  allCommentsSavedInSet(): boolean {
    return this.commentComponents.some(comment => comment.hasUnsavedChanges === true);
  }
}
