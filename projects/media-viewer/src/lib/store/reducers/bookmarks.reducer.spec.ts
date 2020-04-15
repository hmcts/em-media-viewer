import * as fromBookmarks from './bookmarks.reducer';
import {
  CreateBookmarkSuccess,
  LoadBookmarks,
  LoadBookmarksFailure,
  LoadBookmarksSuccess
} from '../actions/bookmarks.action';
import { initialBookmarksState } from './bookmarks.reducer';

describe('BookmarksReducer', () => {

  it('should start loading  bookmarks', function () {
    const state = fromBookmarks.bookmarksReducer(initialBookmarksState, new LoadBookmarks('documentId'));

    expect(state.bookmarks).toEqual([]);
    expect(state.loaded).toBeFalse();
    expect(state.loading).toBeTrue();
  });

  it('should load bookmarks on success', function () {
    const bookmarks = [{
      name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
    }];
    const res = { body: bookmarks, status: 200 };
    const state = fromBookmarks.bookmarksReducer(initialBookmarksState, new LoadBookmarksSuccess(res));

    expect(state.bookmarks).toEqual(bookmarks);
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should load bookmarks on failure', function () {
    const res = { body: [], status: 404 };
    const state = fromBookmarks.bookmarksReducer(initialBookmarksState, new LoadBookmarksFailure(res));

    expect(state.bookmarks).toEqual([]);
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should load created bookmark', function () {
    const bookmark = {
      name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
    };
    const state = fromBookmarks.bookmarksReducer(initialBookmarksState, new CreateBookmarkSuccess(bookmark));

    expect(state.bookmarks).toEqual([bookmark]);
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });
});
