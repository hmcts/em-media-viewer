import * as fromBookmarks from '../actions/bookmarks.action';
import { StoreUtils } from '../store-utils';
import { Bookmark, BookmarksState } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

export const initialBookmarksState: BookmarksState = {
  bookmarks: [],
  bookmarkEntities: {},
  editableBookmark: undefined,
  pdfPosition: undefined,
  loaded: false,
  loading: false
};

export function bookmarksReducer (state = initialBookmarksState,
                                  action: fromBookmarks.BookmarksActions): BookmarksState {

  switch (action.type) {

    case fromBookmarks.UPDATE_PDF_POSITION: {
      const pdfPosition = action.payload;
      return {
        ...state,
        pdfPosition: pdfPosition
      }
    }

    case fromBookmarks.LOAD_BOOKMARKS: {
      return {
        ...state,
        loading: true
      }
    }

    case fromBookmarks.LOAD_BOOKMARKS_SUCCESS:
    case fromBookmarks.LOAD_BOOKMARKS_FAIL:{
      const bookmarks = action.payload.status === 200 ? action.payload.body : [];
      const bookmarkEntities = StoreUtils.generateBookmarkEntities(bookmarks);
      return {
        ...state,
        bookmarks,
        bookmarkEntities,
        loaded: true
      }
    }

    case fromBookmarks.CREATE_BOOKMARK_SUCCESS: {
      const bookmark: Bookmark = action.payload;
      const bookmarkEntities = {
        ...state.bookmarkEntities,
        [bookmark.id]: bookmark,
      }
      const editableBookmark = bookmark.id;
      return {
        ...state,
        bookmarkEntities,
        editableBookmark,
        loading: false,
        loaded: true
      }
    }

    case fromBookmarks.DELETE_BOOKMARK_SUCCESS: {
      const bookmarkId: string = action.payload;
      const bookmarkEntities = { ...state.bookmarkEntities };
      delete bookmarkEntities[bookmarkId];
      return {
        ...state,
        bookmarkEntities,
        loading: false,
        loaded: true
      }
    }

    case fromBookmarks.UPDATE_BOOKMARK_SUCCESS: {
      const bookmark: Bookmark = action.payload;
      const bookmarkEntities = {
        ...state.bookmarkEntities,
        [bookmark.id]: { ...bookmark }
      };
      const editableBookmark = undefined;
      return {
        ...state,
        bookmarkEntities,
        editableBookmark,
        loading: false,
        loaded: true
      }
    }
  }

  return state;
}

export const getBookmarkEnts = (state: BookmarksState) => state.bookmarkEntities;
export const getEditBookmark = (state: BookmarksState) => state.editableBookmark;
export const getPdfPos = (state: BookmarksState) => state.pdfPosition;
