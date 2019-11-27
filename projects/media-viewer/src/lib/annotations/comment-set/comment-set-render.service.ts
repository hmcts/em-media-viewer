import { Injectable } from '@angular/core';
import { CommentComponent } from './comment/comment.component';

@Injectable()
export class CommentSetRenderService {

  redrawCommentComponents(commentComponents: CommentComponent[], height: number, rotate: number, zoom: number) {
    setTimeout(() => {
      let previousComment: CommentComponent;
      this.sortCommentComponents(commentComponents, height, rotate).forEach((comment: CommentComponent) => {
        previousComment = this.isOverlapping(comment, previousComment, zoom);
      });
    });
  }

  sortCommentComponents(commentComponents: CommentComponent[], height: number, rotate: number) {
    return commentComponents.sort((a: CommentComponent, b: CommentComponent) => {
      if (rotate === 90) {
        a.commentTopPos = a._rectangle.x;
        b.commentTopPos = b._rectangle.x;
      } else if (rotate === 180) {
        a.commentTopPos = height - (a._rectangle.y + a._rectangle.height);
        b.commentTopPos = height - (b._rectangle.y + b._rectangle.height);
      } else if (rotate === 270) {
        a.commentTopPos = height - (a._rectangle.x + a._rectangle.width);
        b.commentTopPos = height - (b._rectangle.x + b._rectangle.width);
      } else {
        a.commentTopPos = a._rectangle.y;
        b.commentTopPos = b._rectangle.y;
      }
      return this.processSort(a, b);
    });
  }

  isOverlapping(commentItem: CommentComponent, previousCommentItem: CommentComponent, zoom: number): CommentComponent {
    if (previousCommentItem) {
      const endOfPreviousCommentItem = (previousCommentItem.commentTopPos
        + (previousCommentItem.form.nativeElement.getBoundingClientRect().height / zoom));
      if (commentItem.commentTopPos <= endOfPreviousCommentItem) {
        commentItem.commentTopPos = endOfPreviousCommentItem;
      }
    }
    return commentItem;
  }

  processSort(a: CommentComponent, b: CommentComponent): number {
    if (this.isAnnotationOnSameLine(a, b)) {
      return a.commentLeftPos >= b.commentLeftPos ? 1 : -1;
    }
    return a.commentTopPos >= b.commentTopPos ? 1 : -1
  }

  isAnnotationOnSameLine(a: CommentComponent, b: CommentComponent): boolean {
    const delta = (a.form.nativeElement.height >= b.form.nativeElement.height) ? a.form.nativeElement.height : b.form.nativeElement.height;
    return this.difference(a.commentTopPos, b.commentTopPos) <= delta;
  }

  difference(a: number, b: number): number { return Math.abs(a - b); }
}
