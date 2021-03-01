import * as fromBookmarks from '../actions/bookmark.actions';
import { Bookmark } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import { StoreUtils } from '../store-utils';
import { generateBookmarkEntities } from '../bookmarks-store-utils';

export interface BookmarksState {
  bookmarks: Bookmark[];
  bookmarkEntities: { [id: string]: Bookmark };
  bookmarkPageEntities: {[id: string]: any};
  editableBookmark: string;
  loaded: boolean;
  loading: boolean;
}

export const initialBookmarksState: BookmarksState = {
  bookmarks: [],
  bookmarkEntities: {},
  bookmarkPageEntities: {},
  editableBookmark: undefined,
  loaded: false,
  loading: false
};

export function bookmarksReducer (state = initialBookmarksState,
                                  action: fromBookmarks.BookmarksActions): BookmarksState {

  switch (action.type) {

    case fromBookmarks.LOAD_BOOKMARKS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromBookmarks.LOAD_BOOKMARKS_SUCCESS:
    case fromBookmarks.LOAD_BOOKMARKS_FAIL: {
      const bookmarks = action.payload.status === 200 ? action.payload.body : [];
      const bookmarkEntities = generateBookmarkEntities(bookmarks);
      const bookmarkPageEntities = StoreUtils.groupByKeyEntities(bookmarks, 'pageNumber');

      return {
        ...state,
        bookmarks,
        bookmarkEntities,
        bookmarkPageEntities,
        loaded: true
      };
    }

    case fromBookmarks.CREATE_BOOKMARK_SUCCESS: {
      const bookmark: Bookmark = action.payload;
      const bookmarkEntities = {
        ...state.bookmarkEntities,
        [bookmark.id]: bookmark,
      };
      const bookmarkArray = Object.keys(bookmarkEntities).map(key => bookmarkEntities[key]);
      const bookmarkPageEntities = StoreUtils.groupByKeyEntities(bookmarkArray, 'pageNumber');
      const editableBookmark = bookmark.id;
      return {
        ...state,
        bookmarkEntities,
        editableBookmark,
        bookmarkPageEntities,
        loading: false,
        loaded: true
      };
    }

    case fromBookmarks.MOVE_BOOKMARK_SUCCESS: {
      const movedBookmarks = generateBookmarkEntities(action.payload);
      const bookmarkEntities = {
        ...state.bookmarkEntities,
        ...movedBookmarks
      };
      return {
        ...state,
        bookmarkEntities,
        loading: false,
        loaded: true
      };
    }

    case fromBookmarks.DELETE_BOOKMARK_SUCCESS: {
      const bookmarkIds: string[] = action.payload;
      const bookmarkEntities = { ...state.bookmarkEntities };
      const bookmarkPageEntities = { ...state.bookmarkPageEntities };
      const removeBookmarksByPage: {[pageNumber: number]: string[]} = {};
      bookmarkIds.forEach(bookmarkId => {
        if (removeBookmarksByPage[bookmarkEntities[bookmarkId].pageNumber] !== undefined &&
          removeBookmarksByPage[bookmarkEntities[bookmarkId].pageNumber].length > 0) {
          removeBookmarksByPage[bookmarkEntities[bookmarkId].pageNumber].push(bookmarkId);
        } else {
          removeBookmarksByPage[bookmarkEntities[bookmarkId].pageNumber] = [bookmarkId];
        }
        delete bookmarkEntities[bookmarkId];
      });

      Object.entries(removeBookmarksByPage).forEach(
        ([pageNumber, bmrkIds]) => {
          bookmarkPageEntities[pageNumber] = bookmarkPageEntities[pageNumber].filter(bookmarkId => bmrkIds.includes(bookmarkId));
        }
      );

      return {
        ...state,
        bookmarkEntities,
        bookmarkPageEntities,
        loading: false,
        loaded: true
      };
    }

    case fromBookmarks.UPDATE_BOOKMARK_SUCCESS: {
      const bookmark: Bookmark = action.payload;
      const bookmarkEntities = {
        ...state.bookmarkEntities,
        [bookmark.id]: { ...bookmark }
      };
      const bookmarkArray = Object.keys(bookmarkEntities).map(key => bookmarkEntities[key]);
      const bookmarkPageEntities = StoreUtils.groupByKeyEntities(bookmarkArray, 'pageNumber');
      const editableBookmark = undefined;
      return {
        ...state,
        bookmarkEntities,
        editableBookmark,
        bookmarkPageEntities,
        loading: false,
        loaded: true
      };
    }
  }
  return state;
}

export const getBookmarks = (state: BookmarksState) => state.bookmarks;
export const getBookmarkEnts = (state: BookmarksState) => state.bookmarkEntities;
export const getBookmarkPageEnt = (state: BookmarksState) => state.bookmarkPageEntities;
export const getEditBookmark = (state: BookmarksState) => state.editableBookmark;
