import { inject, TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as bookmarkActions from '../actions/bookmarks.action';
import { BookmarksEffects } from './bookmarks.effects';
import { BookmarksApiService } from '../../annotations/bookmarks-api.service';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from '../reducers/reducers';
import { UpdatePdfPosition } from '../actions/bookmarks.action';

describe('Bookmark Effects', () => {
  let actions$;
  let effects: BookmarksEffects;
  const bookmarksApi = jasmine.createSpyObj('BookmarksApiService', [
    'getBookmarks',
    'createBookmark',
    'updateBookmark',
    'deleteBookmark'
  ]);
  const bookmark = {
    name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
  };
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
    effects = TestBed.get(BookmarksEffects);
  });

  describe('getBookmarks$', () => {
    it('should return a LoadBookmarksSuccess', () => {
      const bookmarks = [bookmark];
      const payload = {body: bookmarks, status: 200};
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
      store.dispatch(new UpdatePdfPosition(pdfPosition));
      const action = new bookmarkActions.CreateBookmark({ ...bookmarkInfo, name: 'new bookmark' } as any);
      bookmarksApi.createBookmark.and.returnValue(of(bookmark));
      const completion = new bookmarkActions.CreateBookmarkSuccess(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.createBookmark$).toBeObservable(expected);
    }));

    it('should return a CreateBookmarkFailure', inject([Store],(store) => {
      const action = new bookmarkActions.CreateBookmark({ ...bookmarkInfo, name: 'new bookmark' } as any);
      store.dispatch(new UpdatePdfPosition(pdfPosition));
      bookmarksApi.createBookmark.and.returnValue(throwError(bookmark));
      const completion = new bookmarkActions.CreateBookmarkFailure(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.createBookmark$).toBeObservable(expected);
    }));
  });

  describe('deleteBookmark$', () => {
    it('should return a DeleteBookmarkSuccess', () => {
      const action = new bookmarkActions.DeleteBookmark('1bee8923-c936-47f6-9186-52581e4901fd');
      bookmarksApi.deleteBookmark.and.returnValue(of('1bee8923-c936-47f6-9186-52581e4901fd'));
      const completion = new bookmarkActions.DeleteBookmarkSuccess('1bee8923-c936-47f6-9186-52581e4901fd');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.deleteBookmark$).toBeObservable(expected);
    });

    it('should return a DeleteBookmarkFailure', () => {
      const action = new bookmarkActions.DeleteBookmark('1bee8923-c936-47f6-9186-52581e4901fd');
      bookmarksApi.deleteBookmark.and.returnValue(throwError('1bee8923-c936-47f6-9186-52581e4901fd'));
      const completion = new bookmarkActions.DeleteBookmarkFailure('1bee8923-c936-47f6-9186-52581e4901fd');
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

