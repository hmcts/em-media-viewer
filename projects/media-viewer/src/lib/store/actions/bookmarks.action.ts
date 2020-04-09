import { Action } from '@ngrx/store';
import { Bookmark } from '../reducers/bookmarks.reducer';

export const LOAD_BOOKMARKS = '[Bookmarks] Load Bookmarks';
export const LOAD_BOOKMARKS_SUCCESS = '[Bookmarks] Load Bookmarks Success';
export const LOAD_BOOKMARKS_FAIL = '[Bookmarks] Load Bookmarks Fail';
export const CREATE_BOOKMARK = '[Bookmarks] Create Bookmark';
export const CREATE_BOOKMARK_SUCCESS = '[Bookmarks] Create Bookmark Success';
export const CREATE_BOOKMARK_FAIL = '[Bookmarks] Create Bookmark Fail';
export const DELETE_BOOKMARK = '[Bookmarks] Delete Bookmark';
export const DELETE_BOOKMARK_SUCCESS = '[Bookmarks] Delete Bookmark Success';
export const DELETE_BOOKMARK_FAIL = '[Bookmarks] Delete Bookmark Fail';

export class LoadBookmarks implements Action {
  readonly type = LOAD_BOOKMARKS;
  constructor(public payload: string) {}
}

export class LoadBookmarksSuccess implements Action {
  readonly type = LOAD_BOOKMARKS_SUCCESS;
  constructor(public payload: { body: Bookmark[], status: string }) { }
}

export class LoadBookmarksFail implements Action {
  readonly type = LOAD_BOOKMARKS_FAIL;
  constructor(public payload: { body: Bookmark[], status: string }) { }
}

export class CreateBookmark implements Action {
  readonly type = CREATE_BOOKMARK;
  constructor(public payload: Bookmark) { }
}

export class CreateBookmarkSuccess implements Action {
  readonly type = CREATE_BOOKMARK_SUCCESS;
  constructor(public payload: Bookmark) {}
}

export class CreateBookmarkFail implements Action {
  readonly type = CREATE_BOOKMARK_FAIL;
  constructor(public payload: Bookmark) { }
}

export class DeleteBookmark implements Action {
  readonly type = DELETE_BOOKMARK;
  constructor(public payload: string) {}
}

export class DeleteBookmarkSuccess implements Action {
  readonly type = DELETE_BOOKMARK_SUCCESS;
  constructor(public payload: string) { }
}

export class DeleteBookmarkFail implements Action {
  readonly type = DELETE_BOOKMARK_FAIL;
  constructor(public payload: string) { }
}

export type BookmarksActions =
  | LoadBookmarks
  | LoadBookmarksSuccess
  | LoadBookmarksFail
  | CreateBookmark
  | CreateBookmarkSuccess
  | CreateBookmarkFail;
