import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { Annotation } from '../annotation-set/annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { Comment } from './comment/comment.model';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { CommentComponent } from './comment/comment.component';
import { AnnotationService, SelectionAnnotation } from '../annotation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mv-comment-set',
  templateUrl: './comment-set.component.html',
  styleUrls: ['./comment-set.component.scss']
})
export class CommentSetComponent implements OnInit {

  @Input() annotationSet: AnnotationSet;
  @Input() page: number;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() height: number;

  comments: Comment[];
  selectAnnotation: SelectionAnnotation = { annotationId: '', editable: false };
  subscription: Subscription;
  pageContainer;
  pageWrapper;

  @ViewChild('container') container: ElementRef;
  @ViewChildren('commentComponent') commentComponents: QueryList<CommentComponent>;

  constructor(private readonly api: AnnotationApiService,
              private readonly annotationService: AnnotationService) { }

  ngOnInit() {
    this.subscription = this.annotationService.getSelectedAnnotation()
      .subscribe((selectedAnnotation) => this.selectAnnotation = selectedAnnotation);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.pageContainer.remove();
    this.pageWrapper.remove();
  }

  initialise(eventSource: PageEvent['source']) {
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

  public getCommentsOnPage(): Comment[] {
    return this.annotationSet.annotations.map(a => {
      if (a.page === this.page) {
        return a.comments[0];
      }
    });
  }

  public onSelect(annotationId) {
    this.annotationService.onAnnotationSelection(annotationId);
  }

  public onCommentDelete(comment: Comment) {
    const annotation = this.annotationSet.annotations.find(anno => anno.id === comment.annotationId);
    annotation.comments = [];
    this.onAnnotationUpdate(annotation);

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
    this.annotationService.onAnnotationSelection({annotationId: annotation.id, editable: false});
  }

  topRectangle(annotationId: string) {
    const annotation = this.annotationSet.annotations.find((annotation) => annotation.id === annotationId);
    return annotation.rectangles.reduce((prev, current) => prev.y < current.y ? prev : current);
  }

  redrawCommentComponents() {
    setTimeout(() => {
      let previousComment: CommentComponent;
      this.sortCommentComponents().forEach((comment: CommentComponent) => {
        previousComment = this.isOverlapping(comment, previousComment);
      });
    });
  }

  sortCommentComponents() {
    return this.commentComponents.map((comment: CommentComponent) => {
      return comment;
    }).sort((a: CommentComponent, b: CommentComponent) => {
      return this.processSort(a, b);
    });
  }

  processSort(a: CommentComponent, b: CommentComponent): number {
    if (this.isAnnotationOnSameLine(a, b)) {
      if (a.commentLeftPos >= b.commentLeftPos) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a.commentTopPos >= b.commentTopPos) {
      return 1;
    } else {
      return -1;
    }
  }

  isAnnotationOnSameLine(a: CommentComponent, b: CommentComponent): boolean {
    const delta = (a.form.nativeElement.height >= b.form.nativeElement.height) ? a.form.nativeElement.height : b.form.nativeElement.height;
    return this.difference(a.commentTopPos, b.commentTopPos) <= delta;
  }

  difference(a: number, b: number): number { return Math.abs(a - b); }

  isOverlapping(commentItem: CommentComponent, previousCommentItem: CommentComponent): CommentComponent {
    commentItem.commentTopPos = commentItem._rectangle.y;
    if (previousCommentItem) {
      const endOfPreviousCommentItem = (previousCommentItem.commentTopPos + previousCommentItem.form.nativeElement.getBoundingClientRect().height);
      if (commentItem.commentTopPos <= endOfPreviousCommentItem) {
        commentItem.commentTopPos = endOfPreviousCommentItem;
      }
    }
    return commentItem;
  }
}
