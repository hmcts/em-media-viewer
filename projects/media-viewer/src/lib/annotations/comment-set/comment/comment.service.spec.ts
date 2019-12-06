import { CommentService } from './comment.service';
import { CommentSetComponent } from '../comment-set.component';

describe('CommentService', () => {

  let commentService: CommentService;

  beforeEach(() => {
    commentService = new CommentService();
  });

  it('should have an empty list at initialisation', () => {
    expect(commentService.commentSets).toEqual([]);
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

  it('get the unsavedChanges state', async () => {
    commentService.unsavedChanges.next(true);

    commentService.getUnsavedChanges().subscribe(changes => expect(changes).toBe(true));
  });

  it('should update the array commentSetComponent at the correct array index', () => {
    commentService.commentSets[1] = null;
    const commentSetMock = {} as CommentSetComponent;

    commentService.updateCommentSets(1, commentSetMock);
    expect(commentService.commentSets[1]).toEqual(commentSetMock);
  });

  it('should reset the commentSets list', () => {
    commentService.commentSets[1] = {} as CommentSetComponent;

    commentService.resetCommentSet();
    expect(commentService.commentSets).toEqual([]);
  });
});
