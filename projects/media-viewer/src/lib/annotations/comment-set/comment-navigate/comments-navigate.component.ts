import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Rectangle } from '../../annotation-set/annotation-view/rectangle/rectangle.model';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import { AnnotationEventService } from '../../annotation-event.service';

@Component({
  selector: 'mv-comments-navigate',
  templateUrl: './comments-navigate.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentsNavigateComponent implements OnChanges {

  @Input() annotationList: Annotation[];
  @Input() autoSelect = false;

  navigationList: string[];
  index = 0;

  constructor(private annotationEvents: AnnotationEventService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.annotationList) {
      this.initNavigationList();
    }
  }

  initNavigationList(): void {
    this.navigationList = this.annotationList
      .map(annotation => ({
        content: annotation.comments[0].content,
        annotationId: annotation.id,
        page: annotation.page,
        rectangle: this.upperRectangle(annotation.rectangles),
      }))
      .sort(this.sortComments)
      .map(mappedComment => mappedComment.annotationId);
    if (this.autoSelect) {
      this.annotationEvents.selectAnnotation({
        annotationId: this.navigationList[0],
        editable: false
      });
    }
  }

  sortComments(mappedCommentA, mappedCommentB) {
    if (mappedCommentA.page !== mappedCommentB.page) {
      return mappedCommentA.page - mappedCommentB.page;
    } else {
      const rectA = mappedCommentA.rectangle;
      const rectB = mappedCommentB.rectangle;
      if(rectA.y !== rectB.y) {
        return rectA.y - rectB.y;
      } else {
        return rectA.x - rectB.x;
      }
    }
  }

  nextSearchItem() {
    if (this.index < this.annotationList.length - 1) {
      this.index += 1;
      this.annotationEvents.selectAnnotation({
        annotationId: this.navigationList[this.index],
        editable: false
      });
    }
  }

  prevSearchItem() {
    if (this.index > 0) {
      this.index -= 1;
      this.annotationEvents.selectAnnotation({
        annotationId: this.navigationList[this.index],
        editable: false
      });
    }
  }

  upperRectangle(rectangles: Rectangle[]) {
    rectangles.sort((rect1, rect2) => rect1.y - rect2.y);
    return { x: rectangles[0].x, y: rectangles[0].y };
  }
}
