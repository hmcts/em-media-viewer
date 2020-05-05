import * as fromBookmarks from './bookmarks.action';

describe('Bookmark actions', () => {
  describe('Delete Bookmark', () => {
    describe('Delete Bookmark', () => {
      it('should create an action', () => {
        const action = new fromBookmarks.DeleteBookmark('1234567');
        expect({ ...action }).toEqual({
          type: fromBookmarks.DELETE_BOOKMARK,
          payload: '1234567'
        });
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
          type: fromBookmarks.DELETE_BOOKMARK_FAILURE,
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
          type: fromBookmarks.UPDATE_BOOKMARK_FAILURE,
          payload: error
        });
      });
    });
  });

});
