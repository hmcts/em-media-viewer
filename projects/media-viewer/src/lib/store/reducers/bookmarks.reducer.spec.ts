import * as fromBookmarks from './bookmarks.reducer';
import {
  CreateBookmarkSuccess,
  LoadBookmarks,
  LoadBookmarksFailure,
  LoadBookmarksSuccess,
  DeleteBookmarkSuccess,
  UpdateBookmarkSuccess
} from '../actions/bookmarks.action';
import { initialBookmarksState } from './bookmarks.reducer';
import { BookmarksState } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

describe('BookmarksReducer', () => {

  it('should start loading  bookmarks', function () {
    const state = fromBookmarks.bookmarksReducer(initialBookmarksState, new LoadBookmarks());

    expect(state.bookmarks).toEqual([]);
    expect(state.bookmarkEntities).toEqual({});
    expect(state.editableBookmark).toBeUndefined();
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

    expect(state.bookmarkEntities).toEqual({ [bookmark.id]: bookmark });
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should delete bookmark', function () {
    const bookmark = {
      name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
    };
    const bookmarksState: BookmarksState = {
      bookmarks: [bookmark],
      bookmarkEntities: { [bookmark.id]: bookmark },
      pdfPosition: undefined,
      editableBookmark: undefined,
      loaded: true,
      loading: false
    };

    const state = fromBookmarks.bookmarksReducer(bookmarksState, new DeleteBookmarkSuccess(bookmark.id));
    expect(state.bookmarkEntities).toEqual({});
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });


  it('should update bookmark', function () {
    const bookmark = {
      name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
    };
    const bookmarksState: BookmarksState = {
      bookmarks: [bookmark],
      bookmarkEntities: { [bookmark.id]: bookmark },
      pdfPosition: undefined,
      editableBookmark: undefined,
      loaded: true,
      loading: false
    };
    bookmark.name = 'updated bookmark';

    const state = fromBookmarks.bookmarksReducer(bookmarksState, new UpdateBookmarkSuccess(bookmark));

    expect(state.bookmarkEntities).toEqual({ [bookmark.id]: bookmark });
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });
});
