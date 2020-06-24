import * as fromBookmarks from '../actions/bookmarks.action';
import { Bookmark } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import { generateBookmarkEntities } from '../bookmarks-store-utils';

export interface BookmarksState {
  bookmarks: Bookmark[],
  bookmarkEntities: { [id: string]: Bookmark },
  editableBookmark: string,
  loaded: boolean,
  loading: boolean
}

export const initialBookmarksState: BookmarksState = {
  bookmarks: [],
  bookmarkEntities: {},
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
      }
    }

    case fromBookmarks.LOAD_BOOKMARKS_SUCCESS:
    case fromBookmarks.LOAD_BOOKMARKS_FAIL:{
      const bookmarks = action.payload.status === 200 ? action.payload.body : [];
      const bookmarkEntities = generateBookmarkEntities(bookmarks);
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

    case fromBookmarks.MOVE_BOOKMARK_SUCCESS: {
      const movedBookmarks = generateBookmarkEntities(action.payload);
      const bookmarkEntities = {
        ...state.bookmarkEntities,
        ...movedBookmarks
      }
      return {
        ...state,
        bookmarkEntities,
        loading: false,
        loaded: true
      }
    }

    case fromBookmarks.DELETE_BOOKMARK_SUCCESS: {
      const bookmarkIds: string[] = action.payload;
      const bookmarkEntities = { ...state.bookmarkEntities };
      bookmarkIds.forEach(bookmarkId => delete bookmarkEntities[bookmarkId]);
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

export const getBookmarks = (state: BookmarksState) => state.bookmarks;
export const getBookmarkEnts = (state: BookmarksState) => state.bookmarkEntities;
export const getEditBookmark = (state: BookmarksState) => state.editableBookmark;
