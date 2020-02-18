import { CommentService } from './comment.service';
import { CommentSetComponent } from '../comment-set.component';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import { fakeAsync } from '@angular/core/testing';

describe('CommentService', () => {

  let commentService: CommentService;

  beforeEach(() => {
    commentService = new CommentService();
  });

  it('should have an empty list at initialisation', () => {
    expect(commentService.commentSetComponent).toBeNull();
  });

  it('should update unsavedChange status to true', () => {
    spyOn(commentService.unsavedChanges, 'next');
    commentService.onCommentChange(true);

    expect(commentService.unsavedChanges.next).toHaveBeenCalledTimes(1);
    expect(commentService.unsavedChanges.next).toHaveBeenCalledWith(true);
  });

  it('should update unsavedChange status to false', () => {
    spyOn(commentService.unsavedChanges, 'next');
    commentService.onCommentChange(false);

    expect(commentService.unsavedChanges.next).toHaveBeenCalledTimes(1);
    expect(commentService.unsavedChanges.next).toHaveBeenCalledWith(false);
  });

  it('should get the unsavedChanges state', fakeAsync((done) => {
    let changes = false;
    commentService.getUnsavedChanges()
      .subscribe(
        rsp => changes = rsp
        , error => done(error)
      );
    commentService.unsavedChanges.next(true);

    expect(changes).toBe(true);
  }));

  it('should reset the commentSets list', () => {
    commentService.commentSetComponent = {} as CommentSetComponent;

    commentService.resetCommentSet();
    expect(commentService.commentSetComponent).toBeNull();
  });

  it('hasUnsavedComments should return false when annotation comments are empty', () => {
    const annotation = {
      comments: []
    } as Annotation;

    expect(commentService.hasUnsavedComments(annotation)).toBeFalsy();
  });

  it('onCommentChange should be called with false when commentSets is empty', () => {
    spyOn(commentService.unsavedChanges, 'next');

    commentService.allCommentsSaved();

    expect(commentService.unsavedChanges.next).toHaveBeenCalledTimes(1);
    expect(commentService.unsavedChanges.next).toHaveBeenCalledWith(false);
  });
});
