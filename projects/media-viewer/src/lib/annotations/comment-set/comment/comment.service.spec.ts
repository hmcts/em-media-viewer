import {CommentService} from './comment.service';

describe('CommentService', () => {
  let commentService: CommentService;
  beforeEach(() => {
    commentService = new CommentService();
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
});
