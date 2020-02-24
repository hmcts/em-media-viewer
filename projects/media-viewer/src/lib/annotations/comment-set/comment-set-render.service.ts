import { Injectable } from '@angular/core';
import { CommentComponent } from './comment/comment.component';

@Injectable()
export class CommentSetRenderService {

  redrawComponents(commentComponents: CommentComponent[], pageHeights: any[], rotate: number, zoom: number) {
    let prevComment: CommentComponent;
    this.sortComponents(commentComponents, pageHeights, rotate, zoom).forEach((comment: CommentComponent) => {
      this.adjustIfOverlapping(comment, prevComment, zoom);
      prevComment = comment;
    });
  }

  sortComponents(commentComponents: CommentComponent[], pageHeights: any[], rotate: number, zoom: number) {
    return commentComponents.sort((a: CommentComponent, b: CommentComponent) => {
      a.rectTop = this.top(a._rectangle, pageHeights[a.page - 1], rotate, zoom);
      b.rectTop = this.top(b._rectangle, pageHeights[b.page - 1], rotate, zoom);
      return this.processSort(a, b);
    });
  }

  private adjustIfOverlapping(comment: CommentComponent, prevComment: CommentComponent, zoom: number): void {
    if (prevComment) {
      const endOfPrevComment = prevComment.commentTop + this.height(prevComment);
      if (comment.commentTop <= endOfPrevComment) {
        comment.rectTop = (endOfPrevComment - comment.totalPreviousPagesHeight) / zoom;
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
}
