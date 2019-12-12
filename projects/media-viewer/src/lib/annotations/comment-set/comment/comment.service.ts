import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommentSetComponent } from '../comment-set.component';
import { Annotation } from '../../annotation-set/annotation/annotation.model';
import { CommentComponent } from './comment.component';

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

  hasUnsavedComments(annotation: Annotation): boolean {
    if (annotation.comments.length > 0) {
      const comment = this.getComment(annotation);
      return comment.hasUnsavedChanges;
    }
    return false;
  }

  updateUnsavedCommentsStatus(annotation: Annotation, editable: boolean): void {
    const comment = this.getComment(annotation);
    comment.hasUnsavedChanges = editable;
    this.allCommentSetsSaved();
  }

  getComment(annotation: Annotation): CommentComponent {
    return this.commentSets[annotation.page].commentComponents
      .find(c => c.comment.annotationId === annotation.comments[0].annotationId);
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
