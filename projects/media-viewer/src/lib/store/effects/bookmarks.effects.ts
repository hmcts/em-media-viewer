import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { BookmarksApiService } from '../../annotations/bookmarks-api.service';
import * as bookmarksActions from '../actions/bookmarks.action';
import { select, Store } from '@ngrx/store';
import { BookmarksState } from '../model/bookmarks.interface';
import * as fromBookmarks from '../selectors/bookmarks.selectors';
import * as fromAnnotations from '../selectors/annotations.selectors';
import uuid from 'uuid';
import * as fromStore from '../reducers/reducers';
import { StoreUtils } from '../store-utils';

@Injectable()
export class BookmarksEffects {

  constructor(private actions$: Actions,
              private store: Store<fromStore.AnnotationSetState|BookmarksState>,
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
    withLatestFrom(
      this.store.pipe(select(fromBookmarks.getBookmarkNodes)),
      this.store.pipe(select(fromAnnotations.getDocumentIdSetId))
    ),
    map(([bookmark, bookmarkNodes, docSetId])   => {
      return {
        ...bookmark,
        id: uuid(),
        name: bookmark.name.substr(0, 30),
        previous: bookmarkNodes.length > 0 ? bookmarkNodes[bookmarkNodes.length - 1].id : undefined,
        documentId: docSetId.documentId
      };
    }),
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
    withLatestFrom(this.store.pipe(select(fromBookmarks.getBookmarkEntities))),
    map(([{ node, from, to }, entities]) => {
      let movedBookmarks = [];
      if (from.next) {
        movedBookmarks.push({ ...from.next, previous: node.previous })
      }
      if (to.next) {
        movedBookmarks.push({ ...to.next, previous: node.id });
      }
      movedBookmarks.push({
        ...node,
        previous: to.previous,
        parent: Object.keys(entities).includes(to.parent) ? to.parent : undefined
      });
      return movedBookmarks;
    }),
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
    map(bookmark => [bookmark.id, ...StoreUtils.getAllChildren(bookmark.children)]),
    exhaustMap((bookmarkIds) =>
      this.bookmarksApiService.deleteMultipleBookmarks(bookmarkIds)
        .pipe(
          map(() => new bookmarksActions.DeleteBookmarkSuccess(bookmarkIds)),
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

