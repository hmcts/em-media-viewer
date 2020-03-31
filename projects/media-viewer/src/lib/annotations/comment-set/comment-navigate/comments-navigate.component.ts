import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Rectangle } from '../../annotation-set/annotation-view/rectangle/rectangle.model';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import {Store} from '@ngrx/store';
import * as fromStore from '../../../store';
import {ToolbarEventService} from '../../../toolbar/toolbar-event.service';

@Component({
  selector: 'mv-comments-navigate',
  templateUrl: './comments-navigate.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentsNavigateComponent implements OnChanges {

  @Input() public readonly annotationList: Annotation[];
  @Input() autoSelect = false;

  navigationList: any[];
  index = 0;

  constructor(private store: Store<fromStore.AnnotationSetState>, public readonly toolbarEvents: ToolbarEventService) {}

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
      .sort(this.sortComments);
    if (this.autoSelect) {

      this.toolbarEvents.setPage(Number.parseInt(this.navigationList[0].page, 0));
      this.store.dispatch(new fromStore.SelectedAnnotation({annotationId: this.navigationList[0].annotationId, editable: false, selected: true}));
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

  nextItem() {
    this.index += 1;
    if (this.index == this.annotationList.length) {
      this.index = 0;
    }
    this.toolbarEvents.setPage(Number.parseInt(this.navigationList[this.index].page, 0));
    this.store.dispatch(new fromStore.SelectedAnnotation({annotationId: this.navigationList[this.index].annotationId, editable: false, selected: true}));
  }


  prevItem() {
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.navigationList.length - 1;
    }
    this.toolbarEvents.setPage(Number.parseInt(this.navigationList[this.index].page, 0));
    this.store.dispatch(new fromStore.SelectedAnnotation({annotationId: this.navigationList[this.index].annotationId, editable: false, selected: true}));
  }

  upperRectangle(rectangles: Rectangle[]) {
    rectangles.sort((rect1, rect2) => rect1.y - rect2.y);
    return { x: rectangles[0].x, y: rectangles[0].y };
  }
}
