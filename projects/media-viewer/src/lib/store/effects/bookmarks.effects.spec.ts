import { inject, TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as bookmarkActions from '../actions/bookmark.actions';
import { BookmarksEffects } from './bookmarks.effects';
import { BookmarksApiService } from '../../annotations/services/bookmarks-api/bookmarks-api.service';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from '../reducers/reducers';
import { PdfPositionUpdate } from '../actions/document.actions';

describe('Bookmark Effects', () => {
  let actions$;
  let effects: BookmarksEffects;
  const bookmarksApi = jasmine.createSpyObj('BookmarksApiService', [
    'getBookmarks',
    'createBookmark',
    'updateBookmark',
    'updateMultipleBookmarks',
    'deleteMultipleBookmarks'
  ]);
  const bookmark = {
    name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
  } as any;
  const pdfPosition = { pageNumber: 0, scale: 1, top: 100, left: 100, rotation: 0 };
  const bookmarkInfo = { xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', pageNumber: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [
        { provide: BookmarksApiService, useValue: bookmarksApi },
        BookmarksEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(BookmarksEffects);
  });

  describe('getBookmarks$', () => {
    it('should return a LoadBookmarksSuccess', () => {
      const bookmarks = [bookmark as any];
      const payload = { body: bookmarks, status: 200 };
      const action = new bookmarkActions.LoadBookmarks();
      bookmarksApi.getBookmarks.and.returnValue(of(payload));
      const completion = new bookmarkActions.LoadBookmarksSuccess(payload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadBookmarks$).toBeObservable(expected);
    });

    it('should return a LoadBookmarkFailure', () => {
      const action = new bookmarkActions.LoadBookmarks();
      bookmarksApi.getBookmarks.and.returnValue(throwError({body: 'error', status: 400}));
      const completion = new bookmarkActions.LoadBookmarksFailure({body: 'error', status: 400});
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadBookmarks$).toBeObservable(expected);
    });
  });

  describe('createBookmark$', () => {
    it('should return a CreateBookmarkSuccess', inject([Store], (store) => {
      store.dispatch(new PdfPositionUpdate(pdfPosition));
      const action = new bookmarkActions.CreateBookmark({ ...bookmarkInfo, name: 'new bookmark' } as any);
      bookmarksApi.createBookmark.and.returnValue(of(bookmark));
      const completion = new bookmarkActions.CreateBookmarkSuccess(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.createBookmark$).toBeObservable(expected);
    }));

    it('should return a CreateBookmarkFailure', inject([Store], (store) => {
      const action = new bookmarkActions.CreateBookmark({ ...bookmarkInfo, name: 'new bookmark' } as any);
      store.dispatch(new PdfPositionUpdate(pdfPosition));
      bookmarksApi.createBookmark.and.returnValue(throwError(bookmark));
      const completion = new bookmarkActions.CreateBookmarkFailure(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.createBookmark$).toBeObservable(expected);
    }));
  });

  describe('moveBookmark$', () => {
    it('should return MoveBookmarkSuccess', () => {
      bookmarksApi.updateMultipleBookmarks.and.returnValue(of([{ id: 'bookmarkId'}]));
      const action = new bookmarkActions.MoveBookmark([{ id: 'bookmarkId'} as any]);
      const completion = new bookmarkActions.MoveBookmarkSuccess([{ id: 'bookmarkId'} as any]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.moveBookmark$).toBeObservable(expected);
    });

    it('should return MoveBookmarkFailure', () => {
      bookmarksApi.updateMultipleBookmarks.and.returnValue(throwError('failure'));
      const action = new bookmarkActions.MoveBookmark([{}] as any);
      const completion = new bookmarkActions.MoveBookmarkFailure('failure');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.moveBookmark$).toBeObservable(expected);
    });
  });
  describe('deleteBookmark$', () => {
    it('should return a DeleteBookmarkSuccess', () => {
      bookmarksApi.deleteMultipleBookmarks.and.returnValue(of({}));
      const action = new bookmarkActions.DeleteBookmark({ deleted: ['bookmarkId'], updated: undefined });
      const completion = new bookmarkActions.DeleteBookmarkSuccess(['bookmarkId']);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.deleteBookmark$).toBeObservable(expected);
    });

    it('should return a DeleteBookmarkFailure', () => {
      bookmarksApi.deleteMultipleBookmarks.and.returnValue(throwError('failure'));
      const action = new bookmarkActions.DeleteBookmark({ id : 'bookmarkId' } as any);
      const completion = new bookmarkActions.DeleteBookmarkFailure('failure');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.deleteBookmark$).toBeObservable(expected);
    });
  });

  describe('updateBookmark$', () => {
    it('should return a UpdateBookmarkSuccess', () => {
      const action = new bookmarkActions.UpdateBookmark(bookmark);
      bookmarksApi.updateBookmark.and.returnValue(of(bookmark));
      const completion = new bookmarkActions.UpdateBookmarkSuccess(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.updateBookmark$).toBeObservable(expected);
    });

    it('should return a UpdateBookmarkFailure', () => {
      const action = new bookmarkActions.UpdateBookmark(bookmark);
      bookmarksApi.updateBookmark.and.returnValue(throwError(bookmark));
      const completion = new bookmarkActions.UpdateBookmarkFailure(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.updateBookmark$).toBeObservable(expected);
    });
  });
});
