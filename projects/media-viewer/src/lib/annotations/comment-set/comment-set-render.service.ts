import { Injectable } from '@angular/core';
import { CommentComponent } from './comment/comment.component';

@Injectable()
export class CommentSetRenderService {

  pageHeights = [];

  redrawComponents(commentComponents: CommentComponent[], pageHeights: any[], containerHeight: number, rotate: number, zoom: number) {
    this.pageHeights = pageHeights;
    let prevComment: CommentComponent;
    this.sortComponents(commentComponents, rotate, zoom).forEach((comment: CommentComponent) => {
      this.adjustIfOverlapping(comment, prevComment, zoom);
      prevComment = comment;
    });
    // prevComment = null;
    // commentComponents.reverse().forEach((comment: CommentComponent) => {
    //   prevComment = this.makeSureWithinContainer(comment, prevComment, containerHeight);
    // });
  }

  sortComponents(commentComponents: CommentComponent[], rotate: number, zoom: number) {
    return commentComponents.sort((a: CommentComponent, b: CommentComponent) => {
      a.rectTop = this.top(a._rectangle, this.getPageHeight(a.page), rotate, zoom);
      b.rectTop = this.top(b._rectangle, this.getPageHeight(b.page), rotate, zoom);
      return this.processSort(a, b);
    });
  }

  private adjustIfOverlapping(comment: CommentComponent, prevComment: CommentComponent, zoom: number): void {
    if (prevComment) {
      const endOfPrevComment = prevComment.commentTop + (this.height(prevComment) / zoom);
      if (comment.commentTop <= endOfPrevComment) {
        comment.rectTop = endOfPrevComment - comment.totalPreviousPagesHeight;
      }
    }
  }

  private processSort(a: CommentComponent, b: CommentComponent): number {
    if (this.onSameLine(a, b)) {
      return a.rectLeft >= b.rectLeft ? 1 : -1;
    }
    return a.commentTop >= b.commentTop ? 1 : -1;
  }

  private onSameLine(a: CommentComponent, b: CommentComponent): boolean {
    return this.difference(a.commentTop, b.commentTop) === 0;
  }

  private top(rectangle: { x, y, height, width }, height: number, rotate: number, zoom: number) {
    const actualHeight = height / zoom;
    switch (rotate) {
      case 90: return rectangle.x;
      case 180: return actualHeight - (rectangle.y + rectangle.height);
      case 270: return actualHeight - (rectangle.x + rectangle.width);
      default: return rectangle.y;
    }
  }

  private height(element: any) {
    return element.form.nativeElement.getBoundingClientRect().height;
  }

  private difference(a: number, b: number): number { return Math.abs(a - b); }

  private makeSureWithinContainer(comment: CommentComponent, prevComment: CommentComponent, containerHeight: number) {
    containerHeight -= 10;
    if (comment.commentBottomPos > containerHeight) {
      comment.rectTop -= comment.commentBottomPos - containerHeight;
    } else if (prevComment) {
      if (comment.commentBottomPos > prevComment.rectTop) {
        comment.rectTop -= comment.commentBottomPos - prevComment.rectTop;
      }
    }
    if (comment.rectTop < 0 ) {
      comment.rectTop = 0;
    }
    return comment;
  }

  private getPageHeight(page: number) {
    return this.pageHeights[page - 1];
  }
}
