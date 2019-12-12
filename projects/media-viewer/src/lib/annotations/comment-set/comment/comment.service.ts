import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommentSetComponent } from '../comment-set.component';
import { Annotation } from '../../annotation-set/annotation/annotation.model';

@Injectable()
export class CommentService {

  public readonly unsavedChanges = new Subject<boolean>();
  commentSets: CommentSetComponent[];

  constructor() {
    this.commentSets = [];
  }

  onCommentChange(changes: boolean): void {
    this.unsavedChanges.next(changes);
  }

  getUnsavedChanges(): Observable<boolean> {
    return this.unsavedChanges.asObservable();
  }

  getUnsavedCommentStatus(annotation: Annotation): boolean {
    if (annotation.comments.length > 0) {
      const comment = this.commentSets[annotation.page].commentComponents
        .find(c => c.comment.annotationId === annotation.comments[0].annotationId);
      return comment.hasUnsavedChanges;
    }
    return false;
  }

  updateUnsavedCommentStatus(annotation: Annotation, editable: boolean): void {
    const comment = this.commentSets[annotation.page].commentComponents
      .find(c => c.comment.annotationId === annotation.comments[0].annotationId);
    comment.hasUnsavedChanges = editable;
    this.allCommentSetsSaved();
  }

  resetCommentSet(): void {
    this.commentSets = [];
  }

  updateCommentSets(index: number, commentSetComponent: CommentSetComponent): void {
    this.commentSets[index] = commentSetComponent;
  }

  allCommentSetsSaved(): void {
    this.onCommentChange(
      this.commentSets.some(commentSet => commentSet.allCommentsSavedInSet()));
  }
}
