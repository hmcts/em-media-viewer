import { BookmarksEffects } from './bookmarks.effects';
import {
  CreateBookmark, CreateBookmarkFailure,
  CreateBookmarkSuccess, DeleteBookmark,
  LoadBookmarks,
  LoadBookmarksFailure,
  LoadBookmarksSuccess
} from '../actions/bookmarks.action';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { DeleteAnnotationSucess } from '../actions/annotations.action';

fdescribe('BookmarksEffects', () => {

  let effects: BookmarksEffects;
  let mockActions$: Observable<Action>;
  const mockApiService = {
    getBookmarks: () => {},
    createBookmark: () => {},
    deleteBookmark: () => {}
  } as any;
  const bookmark = {
    name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
  };
  let expectedAction: Action;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => mockActions$)],
    });
  })

  it('should trigger load bookmarks success',  fakeAsync(() => {
    mockActions$ = of(new LoadBookmarks('url'))
    effects = new BookmarksEffects(mockActions$, mockApiService);
    const mockRsp = { body: [bookmark], status: '200'};
    spyOn(mockApiService, 'getBookmarks').and.returnValue(of(mockRsp))

    effects.loadBookmarks$.subscribe(action => expectedAction = action);
    tick();

    expect(expectedAction).toEqual(new LoadBookmarksSuccess(mockRsp));
  }));

  it('should trigger load bookmarks failure', fakeAsync(() => {
    mockActions$ = of(new LoadBookmarks('url'))
    effects = new BookmarksEffects(mockActions$, mockApiService);
    spyOn(mockApiService, 'getBookmarks').and.returnValue(throwError('error'))

    effects.loadBookmarks$.subscribe(action => expectedAction = action );
    tick();

    expect(expectedAction).toEqual(new LoadBookmarksFailure('error' as any));
  }));

  it('should trigger create bookmarks success',  fakeAsync(() => {
    mockActions$ = of(new CreateBookmark(bookmark))
    effects = new BookmarksEffects(mockActions$, mockApiService);
    const mockRsp = { body: bookmark, status: '201'};
    spyOn(mockApiService, 'createBookmark').and.returnValue(of(mockRsp))

    effects.createBookmark$.subscribe(action => expectedAction = action);
    tick();

    expect(expectedAction).toEqual(new CreateBookmarkSuccess(bookmark));
  }));

  it('should trigger create bookmarks failure', fakeAsync(() => {
    mockActions$ = of(new CreateBookmark(bookmark))
    effects = new BookmarksEffects(mockActions$, mockApiService);
    spyOn(mockApiService, 'createBookmark').and.returnValue(throwError('error'))

    effects.createBookmark$.subscribe(action => expectedAction = action );
    tick();

    expect(expectedAction).toEqual(new CreateBookmarkFailure('error' as any));
  }));

  it('should trigger delete bookmarks success',  fakeAsync(() => {
    mockActions$ = of(new DeleteBookmark('bookmarkId'))
    effects = new BookmarksEffects(mockActions$, mockApiService);
    spyOn(mockApiService, 'deleteBookmark')

    effects.deleteBookmark$.subscribe(action => expectedAction = action);
    tick();

    expect(expectedAction).toEqual(new DeleteAnnotationSucess('bookmarkId'));
  }));

  it('should trigger delete bookmarks failure', fakeAsync(() => {
    mockActions$ = of(new DeleteBookmark('bookmarkId'))
    effects = new BookmarksEffects(mockActions$, mockApiService);
    spyOn(mockApiService, 'deleteBookmark').and.returnValue(throwError('error'))

    effects.deleteBookmark$.subscribe(action => expectedAction = action );
    tick();

    expect(expectedAction).toEqual(new LoadBookmarksFailure('error' as any));
  }));
});
