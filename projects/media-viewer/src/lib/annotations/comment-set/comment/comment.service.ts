import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import type { CommentSetComponent } from '../comment-set.component';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import type { CommentComponent } from './comment.component';

// TODO: replace by NgRx
@Injectable()
export class CommentService {

  public readonly unsavedChanges = new Subject<boolean>();
  public readonly marginToCommentEmitter = new BehaviorSubject<boolean>(false);
  commentSetComponent: CommentSetComponent;

  setCommentSet(commentSetComponent) {
    this.commentSetComponent = commentSetComponent;
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

  updateUnsavedCommentsStatus(annotation: Annotation, hasUnsavedChanges: boolean): void {
    const comment = this.getComment(annotation);
    comment.hasUnsavedChanges = hasUnsavedChanges;
    this.allCommentsSaved();
  }

  getComment(annotation: Annotation): CommentComponent {
    return this.commentSetComponent.commentComponents
      .find(c => c.comment.annotationId === annotation.comments[0].annotationId);
  }

  resetCommentSet(): void {
    this.commentSetComponent = null;
  }

  allCommentsSaved(): void {
    this.onCommentChange(this.commentSetComponent.commentComponents.some(comment => comment.hasUnsavedChanges === true));
  }

  createMarginToCommentEvent(margin: boolean) {
    this.marginToCommentEmitter.next(margin);
  }
}
