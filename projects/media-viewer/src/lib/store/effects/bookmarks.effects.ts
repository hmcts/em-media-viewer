import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { BookmarksApiService } from '../../annotations/bookmarks-api.service';
import * as bookmarksActions from '../actions/bookmarks.action';

@Injectable()
export class BookmarksEffects {

  constructor(private actions$: Actions,
              private bookmarksApiService: BookmarksApiService) {}

  @Effect()
  loadBookmarks$ = this.actions$.pipe(
    ofType(bookmarksActions.LOAD_BOOKMARKS),
    map((action: bookmarksActions.LoadBookmarks) => action.payload),
    exhaustMap((url) => {
      return this.bookmarksApiService.getBookmarks(url).pipe(
        map(res => {
          return new bookmarksActions.LoadBookmarksSuccess(res.body);
        }),
        catchError(error => {
          return of(new bookmarksActions.LoadBookmarksFail([]));
        }));
    }));

  @Effect()
  postAnnotation$ = this.actions$.pipe(
    ofType(bookmarksActions.CREATE_BOOKMARK),
    map((action: bookmarksActions.CreateBookmark) => action.payload),
    exhaustMap((bookmark) => {
      return this.bookmarksApiService.createBookmark(bookmark).pipe(
        map(bookmark => {
          return new bookmarksActions.CreateBookmarkSuccess(bookmark);
        }),
        catchError(error => {
          return of(new bookmarksActions.CreateBookmarkFail(error));
        }));
    }));

  @Effect()
  deleteAnnotation$ = this.actions$.pipe(
    ofType(bookmarksActions.DELETE_BOOKMARK),
    map((action: bookmarksActions.DeleteBookmark) => action.payload),
    exhaustMap((bookmarkId) => {
      return this.bookmarksApiService.deleteBookmark(bookmarkId).pipe(
        map(() => {
          return new bookmarksActions.DeleteBookmarkSuccess(bookmarkId);
        }),
        catchError(error => {
          return of(new bookmarksActions.DeleteBookmarkFail(error));
        }));
    }));
}

