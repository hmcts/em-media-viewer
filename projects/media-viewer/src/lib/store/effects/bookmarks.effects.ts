import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { BookmarksApiService } from '../../annotations/bookmarks-api.service';
import * as bookmarksActions from '../actions/bookmarks.action';
import * as fromStore from '../reducers';
import { select, Store } from '@ngrx/store';
import * as fromAnnotations from '../selectors/annotations.selectors';


@Injectable()
export class BookmarksEffects {

  constructor(private actions$: Actions,
              private store: Store<fromStore.AnnotationSetState>,
              private bookmarksApiService: BookmarksApiService) {}

  @Effect()
  loadBookmarks$ = this.actions$.pipe(
    ofType(bookmarksActions.LOAD_BOOKMARKS),
    withLatestFrom(this.store.pipe(select(fromAnnotations.getDocumentIdSetId))),
    map(([,docSetId]) => docSetId.documentId),
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
    withLatestFrom(this.store.pipe(select(fromAnnotations.getDocumentIdSetId))),
    map(([bookmark, docSetId]) => ({ ...bookmark, documentId: docSetId.documentId })),
    exhaustMap((bookmark) =>
      this.bookmarksApiService.createBookmark(bookmark)
        .pipe(
          map(bookmark => new bookmarksActions.CreateBookmarkSuccess(bookmark)),
          catchError(error => of(new bookmarksActions.CreateBookmarkFailure(error)))
        )
    ));

  @Effect()
  deleteBookmark$ = this.actions$.pipe(
    ofType(bookmarksActions.DELETE_BOOKMARK),
    map((action: bookmarksActions.DeleteBookmark) => action.payload),
    exhaustMap((bookmarkId) =>
      this.bookmarksApiService.deleteBookmark(bookmarkId)
        .pipe(
          map(() => new bookmarksActions.DeleteBookmarkSuccess(bookmarkId)),
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

