import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { Annotation } from '../annotation-set/annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { Comment } from './comment/comment.model';
import { AnnotationService } from '../annotation.service';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';

@Component({
  selector: 'mv-comment-set',
  templateUrl: './comment-set.component.html',
  styleUrls: ['./comment-set.component.css']
})
export class CommentSetComponent {

  @Input() annotationSet: AnnotationSet;
  @Input() page: number;
  @Input() zoom: number;
  @Input() rotate: number;

  comments: Comment[];
  editable = false;
  selected = false;

  @ViewChild('container') container: ElementRef;

  constructor(private readonly api: AnnotationApiService,
              private readonly annotationService: AnnotationService) { }


  initialise(eventSource: PageEvent['source']) {
    this.zoom = eventSource.scale;
    this.rotate = eventSource.rotation;
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

  topRectangle(annotationId: string) {
    const annotation = this.annotationSet.annotations.find((annotation) => annotation.id === annotationId);
    return annotation.rectangles.reduce((prev, current) => prev.y < current.y ? prev : current);

  }
}
