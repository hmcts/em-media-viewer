import * as fromBookmarks from './bookmark.actions';

describe('Bookmark actions', () => {
  describe('Delete Bookmark', () => {
    describe('Delete Bookmark', () => {
      it('should create an action', () => {
        const payload = { deleted: ['1234567'], updated: undefined };
        const action = new fromBookmarks.DeleteBookmark(payload);
        expect({ ...action }).toEqual({ type: fromBookmarks.DELETE_BOOKMARK, payload });
      });
    });
    describe('DeleteBookmarkSuccess', () => {
      it('should create an action', () => {
        const payload: any = 'some1234id';
        const action = new fromBookmarks.DeleteBookmarkSuccess(payload);
        expect({ ...action }).toEqual({
          type: fromBookmarks.DELETE_BOOKMARK_SUCCESS,
          payload
        });
      });
    });
    describe('DeleteBookmarkFail', () => {
      it('should create an action', () => {
        const error: any = 'some error';
        const action = new fromBookmarks.DeleteBookmarkFailure(error);
        expect({ ...action }).toEqual({
          type: fromBookmarks.DELETE_BOOKMARK_FAIL,
          payload: error
        });
      });
    });
  });

  describe('Update Bookmark', () => {
    describe('Update Bookmark', () => {
      it('should create an action', () => {
        const payload: any = {name: 'bookmark name', id: 'id'};
        const action = new fromBookmarks.UpdateBookmark(payload);
        expect({ ...action }).toEqual({
          type: fromBookmarks.UPDATE_BOOKMARK,
          payload: payload
        });
      });
    });
    describe('UpdateBookmarkSuccess', () => {
      it('should create an action', () => {
        const payload: any = {name: 'bookmark name', id: 'id'};
        const action = new fromBookmarks.UpdateBookmarkSuccess(payload);
        expect({ ...action }).toEqual({
          type: fromBookmarks.UPDATE_BOOKMARK_SUCCESS,
          payload: payload
        });
      });
    });
    describe('UpdateBookmarkFail', () => {
      it('should create an action', () => {
        const error: any = 'some error';
        const action = new fromBookmarks.UpdateBookmarkFailure(error);
        expect({ ...action }).toEqual({
          type: fromBookmarks.UPDATE_BOOKMARK_FAIL,
          payload: error
        });
      });
    });
  });

  describe('Move Bookmark', () => {
    describe('Move Bookmark', () => {
      it('should create an action', () => {
        const payload: any = [{ name: 'bookmark name', id: 'id' }];
        const action = new fromBookmarks.MoveBookmark(payload);
        expect({ ...action }).toEqual({
          type: fromBookmarks.MOVE_BOOKMARK,
          payload: payload
        });
      });
    });
    describe('MoveBookmarkSuccess', () => {
      it('should create an action', () => {
        const payload: any = [{ name: 'bookmark name', id: 'id' }];
        const action = new fromBookmarks.MoveBookmarkSuccess(payload);
        expect({ ...action }).toEqual({
          type: fromBookmarks.MOVE_BOOKMARK_SUCCESS,
          payload: payload
        });
      });
    });
    describe('MoveBookmarkFail', () => {
      it('should create an action', () => {
        const error: any = 'some error';
        const action = new fromBookmarks.MoveBookmarkFailure(error);
        expect({ ...action }).toEqual({
          type: fromBookmarks.MOVE_BOOKMARK_FAIL,
          payload: error
        });
      });
    });
  });

});
