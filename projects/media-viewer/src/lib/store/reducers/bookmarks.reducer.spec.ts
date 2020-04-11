import * as fromBookmarks from './bookmarks.reducer';
import {
  CreateBookmarkSuccess,
  LoadBookmarks,
  LoadBookmarksFail,
  LoadBookmarksSuccess
} from '../actions/bookmarks.action';
import { initialBookmarksState } from './bookmarks.reducer';

describe('BookmarksReducer', () => {

  it('should start loading  bookmarks', function () {
    fromBookmarks.bookmarksReducer(initialBookmarksState, new LoadBookmarks('documentId') )
  });

  it('should load bookmarks on success', function () {
    const res = { body: [], status: '200' };
    fromBookmarks.bookmarksReducer(initialBookmarksState, new LoadBookmarksSuccess(res));
  });

  it('should load bookmarks on failure', function () {
    const res = { body: [], status: '404' };
    fromBookmarks.bookmarksReducer(initialBookmarksState, new LoadBookmarksFail(res));
  });

  it('should load created bookmark', function () {
    fromBookmarks.bookmarksReducer(initialBookmarksState, new CreateBookmarkSuccess({} as any));
  });

});
