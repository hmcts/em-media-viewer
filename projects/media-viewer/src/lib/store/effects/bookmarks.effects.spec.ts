import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import {of, throwError} from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as bookmarkActions from '../actions/bookmarks.action';
import {BookmarksEffects} from './bookmarks.effects';
import {BookmarksApiService} from '../../annotations/bookmarks-api.service';


describe('Bookmark Effects', () => {
  let actions$;
  let effects: BookmarksEffects;
  const UserServiceMock = jasmine.createSpyObj('BookmarksApiService', [
    'getBookmarks',
    'createBookmark',
    'updateBookmark',
    'deleteBookmark'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: BookmarksApiService,
          useValue: UserServiceMock,
        },
        BookmarksEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(BookmarksEffects);
  });

  describe('getBookmarks$', () => {
    it('should return a LoadBookmarksSuccess', () => {
      const id = 'id';
      const bookmarks = [{
        name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
      }];
      const payload = {body: bookmarks, status: 200};
      const action = new bookmarkActions.LoadBookmarks();
      UserServiceMock.getBookmarks.and.returnValue(of(payload));
      const completion = new bookmarkActions.LoadBookmarksSuccess(payload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadBookmarks$).toBeObservable(expected);
    });

    it('should return a LoadBookmarkFailure', () => {
      const id = 'id';
      const action = new bookmarkActions.LoadBookmarks();
      UserServiceMock.getBookmarks.and.returnValue(throwError({body: 'error', status: 400}));
      const completion = new bookmarkActions.LoadBookmarksFailure({body: 'error', status: 400});
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadBookmarks$).toBeObservable(expected);
    });
  });

  describe('createBookmark$', () => {
    it('should return a CreateBookmarkSuccess', () => {
      const bookmark = {name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1}
      const action = new bookmarkActions.CreateBookmark(bookmark);
      UserServiceMock.createBookmark.and.returnValue(of(bookmark));
      const completion = new bookmarkActions.CreateBookmarkSuccess(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.createBookmark$).toBeObservable(expected);
    });

    it('should return a CreateBookmarkFailure', () => {
      const bookmark = {name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1}
      const action = new bookmarkActions.CreateBookmark(bookmark);
      UserServiceMock.createBookmark.and.returnValue(throwError(bookmark));
      const completion = new bookmarkActions.CreateBookmarkFailure(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.createBookmark$).toBeObservable(expected);
    });
  });

  describe('deleteBookmark$', () => {
    it('should return a DeleteBookmarkSuccess', () => {
      const action = new bookmarkActions.DeleteBookmark('1bee8923-c936-47f6-9186-52581e4901fd');
      UserServiceMock.deleteBookmark.and.returnValue(of('1bee8923-c936-47f6-9186-52581e4901fd'));
      const completion = new bookmarkActions.DeleteBookmarkSuccess('1bee8923-c936-47f6-9186-52581e4901fd');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.deleteBookmark$).toBeObservable(expected);
    });

    it('should return a DeleteBookmarkFailure', () => {
      const action = new bookmarkActions.DeleteBookmark('1bee8923-c936-47f6-9186-52581e4901fd');
      UserServiceMock.deleteBookmark.and.returnValue(throwError('1bee8923-c936-47f6-9186-52581e4901fd'));
      const completion = new bookmarkActions.DeleteBookmarkFailure('1bee8923-c936-47f6-9186-52581e4901fd');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.deleteBookmark$).toBeObservable(expected);
    });
  });

  describe('updateBookmark$', () => {
    it('should return a UpdateBookmarkSuccess', () => {
      const bookmark = {name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1}
      const action = new bookmarkActions.UpdateBookmark(bookmark);
      UserServiceMock.updateBookmark.and.returnValue(of(bookmark));
      const completion = new bookmarkActions.UpdateBookmarkSuccess(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.updateBookmark$).toBeObservable(expected);
    });

    it('should return a UpdateBookmarkFailure', () => {
      const bookmark = {name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1}
      const action = new bookmarkActions.UpdateBookmark(bookmark);
      UserServiceMock.updateBookmark.and.returnValue(throwError(bookmark));
      const completion = new bookmarkActions.UpdateBookmarkFailure(bookmark);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.updateBookmark$).toBeObservable(expected);
    });
  });
});

