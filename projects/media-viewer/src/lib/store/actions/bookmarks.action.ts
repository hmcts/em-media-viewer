import { Action } from '@ngrx/store';
import { Bookmark, PdfPosition } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

export const LOAD_BOOKMARKS = '[Bookmarks] Load Bookmarks';
export const LOAD_BOOKMARKS_SUCCESS = '[Bookmarks] Load Bookmarks Success';
export const LOAD_BOOKMARKS_FAILURE = '[Bookmarks] Load Bookmarks Failure';
export const CREATE_BOOKMARK = '[Bookmarks] Create Bookmark';
export const CREATE_BOOKMARK_SUCCESS = '[Bookmarks] Create Bookmark Success';
export const CREATE_BOOKMARK_FAILURE = '[Bookmarks] Create Bookmark Failure';
export const DELETE_BOOKMARK = '[Bookmarks] Delete Bookmark';
export const DELETE_BOOKMARK_SUCCESS = '[Bookmarks] Delete Bookmark Success';
export const DELETE_BOOKMARK_FAILURE = '[Bookmarks] Delete Bookmark Failure';
export const UPDATE_BOOKMARK = '[Bookmarks] Update Bookmark';
export const UPDATE_BOOKMARK_SUCCESS = '[Bookmarks] Update Bookmark Success';
export const UPDATE_BOOKMARK_FAILURE = '[Bookmarks] Update Bookmark Failure';
export const UPDATE_PDF_POSITION = '[Bookmarks] Update PDF Position';

export class LoadBookmarks implements Action {
  readonly type = LOAD_BOOKMARKS;
  constructor() {}
}

export class LoadBookmarksSuccess implements Action {
  readonly type = LOAD_BOOKMARKS_SUCCESS;
  constructor(public payload: { body: Bookmark[], status: number}) { }
}

export class LoadBookmarksFailure implements Action {
  readonly type = LOAD_BOOKMARKS_FAILURE;
  constructor(public payload: { body: any, status: number }) { }
}

export class CreateBookmark implements Action {
  readonly type = CREATE_BOOKMARK;
  constructor(public payload: string) { }
}

export class CreateBookmarkSuccess implements Action {
  readonly type = CREATE_BOOKMARK_SUCCESS;
  constructor(public payload: Bookmark) {}
}

export class CreateBookmarkFailure implements Action {
  readonly type = CREATE_BOOKMARK_FAILURE;
  constructor(public payload: Bookmark) {}
}

export class DeleteBookmark implements Action {
  readonly type = DELETE_BOOKMARK;
  constructor(public payload: string) {}
}

export class DeleteBookmarkSuccess implements Action {
  readonly type = DELETE_BOOKMARK_SUCCESS;
  constructor(public payload: string) {}
}

export class DeleteBookmarkFailure implements Action {
  readonly type = DELETE_BOOKMARK_FAILURE;
  constructor(public payload: string) {}
}

export class UpdateBookmark implements Action {
  readonly type = UPDATE_BOOKMARK;
  constructor(public payload: Bookmark) {}
}

export class UpdateBookmarkSuccess implements Action {
  readonly type = UPDATE_BOOKMARK_SUCCESS;
  constructor(public payload: Bookmark) {}
}

export class UpdateBookmarkFailure implements Action {
  readonly type = UPDATE_BOOKMARK_FAILURE;
  constructor(public payload: Bookmark) {}
}

export class UpdatePdfPosition implements Action {
  readonly type = UPDATE_PDF_POSITION;
  constructor(public payload: PdfPosition) {}
}


export type BookmarksActions =
  | LoadBookmarks
  | LoadBookmarksSuccess
  | LoadBookmarksFailure
  | CreateBookmark
  | CreateBookmarkSuccess
  | CreateBookmarkFailure
  | DeleteBookmark
  | DeleteBookmarkSuccess
  | DeleteBookmarkFailure
  | UpdateBookmark
  | UpdateBookmarkSuccess
  | UpdateBookmarkFailure
  | UpdatePdfPosition;
