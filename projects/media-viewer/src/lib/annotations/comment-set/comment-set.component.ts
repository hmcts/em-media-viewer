import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { Annotation } from '../annotation-set/annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { Comment } from './comment/comment.model';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';

@Component({
  selector: 'mv-comment-set',
  templateUrl: './comment-set.component.html',
  styleUrls: ['./comment-set.component.css']
})
export class CommentSetComponent {

  @Input() annotationSet: AnnotationSet;
  @Input() page: number;

  comments: Comment[];
  editable = false;
  selected = false;

  @ViewChild('container') container: ElementRef;

  constructor(private readonly api: AnnotationApiService) { }

  initialise(eventSource: PageEvent['source']) {
    const element = eventSource.div;
    element.appendChild(this.container.nativeElement);

  }

  public getCommentsOnPage(): Comment[] {
    return this.annotationSet.annotations.map(a => {
      if (a.page === this.page) {
        return a.comments[0];
      }
    });
  }

  public onSelect() {
    this.selected = true;
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
  }

  // topRectangle(annotationId) {
  //   return this.annotationSet.annotations.find(annotation => {
  //     if (annotation.id === annotationId) {
  //       return annotation.rectangles.reduce((prev, current) => prev.y < current.y ? prev : current);
  //     } else {
  //       return { annotationId: 0, height: 0,  width: 0, x: 0, y: 0 };
  //     }
  //   });
  // }
}
