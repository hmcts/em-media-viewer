import { Injectable } from '@angular/core';
import { CommentComponent } from './comment/comment.component';

@Injectable()
export class CommentSetRenderService {

  redrawComponents(commentComponents: CommentComponent[], height: number, rotate: number, zoom: number) {
      let prevComment: CommentComponent;
      this.sortComponents(commentComponents, height, rotate).forEach((comment: CommentComponent) => {
        this.adjustIfOverlapping(comment, prevComment, zoom);
        prevComment = comment;
      });
      prevComment = null;
      commentComponents.reverse().forEach((comment: CommentComponent) => {
        prevComment = this.makeSureWithinContainer(comment, prevComment, height);
      });
  }

  sortComponents(commentComponents: CommentComponent[], height: number, rotate: number) {
    return commentComponents.sort((a: CommentComponent, b: CommentComponent) => {
      a.rectTop = this.top(a._rectangle, rotate, height);
      b.rectTop = this.top(b._rectangle, rotate, height);
      return this.processSort(a, b);
    });
  }

  private adjustIfOverlapping(comment: CommentComponent, prevComment: CommentComponent, zoom: number): void {
    if (prevComment) {
      const endOfPrevComment = prevComment.rectTop + (this.height(prevComment) / zoom);
      if (comment.rectTop <= endOfPrevComment) {
        comment.rectTop = endOfPrevComment;
      }
    }
  }

  private processSort(a: CommentComponent, b: CommentComponent): number {
    if (this.overlapping(a, b)) {
      return a.rectLeft >= b.rectLeft ? 1 : -1;
    }
    return a.rectTop >= b.rectTop ? 1 : -1;
  }

  private overlapping(a: CommentComponent, b: CommentComponent): boolean {
    const highest = (this.height(a) >= this.height(b)) ? this.height(a) : this.height(b);
    return this.difference(a.rectTop, b.rectTop) <= highest;
  }

  private top(rectangle: { x, y, height, width }, rotate: number, height: number) {
    switch (rotate) {
      case 90: return rectangle.x;
      case 180: return  height - (rectangle.y + rectangle.height);
      case 270: return height - (rectangle.x + rectangle.width);
      default: return rectangle.y;
    }
  }

  private height(element: any) {
    return element.form.nativeElement.getBoundingClientRect().height;
  }

  private difference(a: number, b: number): number { return Math.abs(a - b); }

  private makeSureWithinContainer(commentItem: CommentComponent, previousCommentItem: CommentComponent, containerHeight: number) {
    containerHeight -= 10;
    if (commentItem.commentBottomPos > containerHeight) {
      commentItem.rectTop -= commentItem.commentBottomPos - containerHeight;
    }
    if (previousCommentItem) {
      if (commentItem.commentBottomPos > previousCommentItem.rectTop) {
        commentItem.rectTop -= commentItem.commentBottomPos - previousCommentItem.rectTop;
      }
    }
    if (commentItem.rectTop < 0 ) {
      commentItem.rectTop = 0;
    }
    return commentItem;
  }
}
