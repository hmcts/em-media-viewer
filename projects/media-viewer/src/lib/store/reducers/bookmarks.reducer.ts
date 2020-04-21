import * as fromBookmarks from '../actions/bookmarks.action';

export interface BookmarksState {
  bookmarks: Bookmark[];
  loaded: boolean,
  loading: boolean
}

export interface Bookmark {
  id: string;
  documentId: string;
  name: string;
  pageNumber: number;
  xCoordinate: number;
  yCoordinate: number;
  zoom: number
}

export const initialBookmarksState: BookmarksState = {
  bookmarks: [],
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
      return {
        ...state,
        bookmarks,
        loaded: true
      }
    }

    case fromBookmarks.CREATE_BOOKMARK_SUCCESS: {
      const bookmark: Bookmark = action.payload;
      const bookmarks = [...state.bookmarks, bookmark];
      return {
        ...state,
        bookmarks,
        loading: false,
        loaded: true
      }
    }

    case fromBookmarks.DELETE_BOOKMARK_SUCCESS: {
      const id: String = action.payload;
      const bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);
      return {
        ...state,
        bookmarks
      }
    }

    case fromBookmarks.UPDATE_BOOKMARK_SUCCESS: {
      const bookmark: Bookmark = action.payload;
      const name = bookmark.name;
      const bookmarks = state.bookmarks.map(bmark => {
        if (bmark.id === bookmark.id) {
          return {
            ...bmark,
            name
          }
        } else {
          return bmark;
        }
      })
      return {
        ...state,
        bookmarks
      }
    }
  }

  return state;
}

export const getBookmarks = (state: BookmarksState) => state.bookmarks;
