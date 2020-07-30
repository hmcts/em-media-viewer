import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { BookmarksApiService } from '../../annotations/bookmarks-api.service';
import * as bookmarksActions from '../actions/bookmarks.action';
import { select, Store } from '@ngrx/store';
import * as fromDocument from '../selectors/document.selectors';
import * as fromBookmarks from '../reducers/bookmarks.reducer';
import * as fromStore from '../reducers/reducers';

@Injectable()
export class BookmarksEffects {

  constructor(private actions$: Actions,
              private store: Store<fromStore.AnnotationSetState|fromBookmarks.BookmarksState>,
              private bookmarksApiService: BookmarksApiService) {}

  @Effect()
  loadBookmarks$ = this.actions$.pipe(
    ofType(bookmarksActions.LOAD_BOOKMARKS),
    withLatestFrom(this.store.pipe(select(fromDocument.getDocumentId))),
    map(([,documentId]) => documentId),
    exhaustMap((documentId) =>
      this.bookmarksApiService.getBookmarks(documentId)
        .pipe(
          map(res => new bookmarksActions.LoadBookmarksSuccess(res)),
          catchError(err => of(new bookmarksActions.LoadBookmarksFailure(err)))
        )
    ));

  @Effect()
  createBookmark$ = this.actions$.pipe(
    ofType(bookmarksActions.CREATE_BOOKMARK),
    map((action: bookmarksActions.CreateBookmark) => action.payload),
    exhaustMap((bookmark) =>
      this.bookmarksApiService.createBookmark(bookmark)
        .pipe(
          map(bookmark => new bookmarksActions.CreateBookmarkSuccess(bookmark)),
          catchError(error => of(new bookmarksActions.CreateBookmarkFailure(error)))
        )
    ));

  @Effect()
  moveBookmark$ = this.actions$.pipe(
    ofType(bookmarksActions.MOVE_BOOKMARK),
    map((action: bookmarksActions.MoveBookmark) => action.payload),
    exhaustMap((bookmarks) =>
      this.bookmarksApiService.updateMultipleBookmarks(bookmarks)
        .pipe(
          map(bookmarks => new bookmarksActions.MoveBookmarkSuccess(bookmarks)),
          catchError(error => of(new bookmarksActions.MoveBookmarkFailure(error)))
        )
    ));

  @Effect()
  deleteBookmark$ = this.actions$.pipe(
    ofType(bookmarksActions.DELETE_BOOKMARK),
    map((action: bookmarksActions.DeleteBookmark) => action.payload),
    exhaustMap(({ deleted, updated }) =>
      this.bookmarksApiService.deleteMultipleBookmarks({ deleted, updated })
        .pipe(
          switchMap(() => {
            if (updated) {
              return [
                new bookmarksActions.DeleteBookmarkSuccess(deleted),
                new bookmarksActions.UpdateBookmarkSuccess(updated)
              ]
            } else {
              return [new bookmarksActions.DeleteBookmarkSuccess(deleted)];
            }
          }),
          catchError(error => of(new bookmarksActions.DeleteBookmarkFailure(error)))
        )
    ));

  @Effect()
  updateBookmark$ = this.actions$.pipe(
    ofType(bookmarksActions.UPDATE_BOOKMARK),
    map((action: bookmarksActions.UpdateBookmark) => action.payload),
    switchMap((bookmark) =>
      this.bookmarksApiService.updateBookmark(bookmark)
        .pipe(
          map(bookmark => new bookmarksActions.UpdateBookmarkSuccess(bookmark)),
          catchError(error => of(new bookmarksActions.UpdateBookmarkFailure(error)))
        )
    ));
}

