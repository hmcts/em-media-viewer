import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { BookmarksApiService } from '../../annotations/services/bookmarks-api/bookmarks-api.service';
import * as bookmarksActions from '../actions/bookmark.actions';
import { select, Store } from '@ngrx/store';
import * as fromDocument from '../selectors/document.selectors';
import * as fromBookmarks from '../reducers/bookmarks.reducer';
import * as fromStore from '../reducers/reducers';

@Injectable()
export class BookmarksEffects {

  constructor(private actions$: Actions,
              private store: Store<fromStore.AnnotationSetState|fromBookmarks.BookmarksState>,
              private bookmarksApiService: BookmarksApiService) {}

  loadBookmarks$ = createEffect(() =>
    this.actions$.pipe(
    ofType(bookmarksActions.LOAD_BOOKMARKS),
    withLatestFrom(this.store.pipe(select(fromDocument.getDocumentId))),
    map(([, documentId]) => documentId),
    exhaustMap((documentId) =>
      this.bookmarksApiService.getBookmarks(documentId)
        .pipe(
          map(res => new bookmarksActions.LoadBookmarksSuccess(res)),
          catchError(err => of(new bookmarksActions.LoadBookmarksFailure(err)))
        )
    ))
  );

  createBookmark$ = createEffect(() =>
    this.actions$.pipe(
    ofType(bookmarksActions.CREATE_BOOKMARK),
    map((action: bookmarksActions.CreateBookmark) => action.payload),
    exhaustMap((bookmark) =>
      this.bookmarksApiService.createBookmark(bookmark)
        .pipe(
          map(bmrk => new bookmarksActions.CreateBookmarkSuccess(bmrk)),
          catchError(error => of(new bookmarksActions.CreateBookmarkFailure(error)))
        )
    ))
  );

  moveBookmark$ = createEffect(() =>
    this.actions$.pipe(
    ofType(bookmarksActions.MOVE_BOOKMARK),
    map((action: bookmarksActions.MoveBookmark) => action.payload),
    exhaustMap((bookmarks) =>
      this.bookmarksApiService.updateMultipleBookmarks(bookmarks)
        .pipe(
          map(bmrks => new bookmarksActions.MoveBookmarkSuccess(bmrks)),
          catchError(error => of(new bookmarksActions.MoveBookmarkFailure(error)))
        )
    ))
  );

  deleteBookmark$ = createEffect(() =>
    this.actions$.pipe(
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
              ];
            } else {
              return [new bookmarksActions.DeleteBookmarkSuccess(deleted)];
            }
          }),
          catchError(error => of(new bookmarksActions.DeleteBookmarkFailure(error)))
        )
    ))
  );

  updateBookmark$ = createEffect(() =>
    this.actions$.pipe(
    ofType(bookmarksActions.UPDATE_BOOKMARK),
    map((action: bookmarksActions.UpdateBookmark) => action.payload),
    switchMap((bookmark) =>
      this.bookmarksApiService.updateBookmark(bookmark)
        .pipe(
          map(bmrk => new bookmarksActions.UpdateBookmarkSuccess(bmrk)),
          catchError(error => of(new bookmarksActions.UpdateBookmarkFailure(error)))
        )
    ))
  );
}
