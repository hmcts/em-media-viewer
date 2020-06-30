import {
  CreateBookmarkSuccess,
  LoadBookmarks,
  LoadBookmarksFailure,
  LoadBookmarksSuccess,
  DeleteBookmarkSuccess,
  UpdateBookmarkSuccess, MoveBookmarkSuccess
} from '../actions/bookmarks.action';
import * as fromBookmarks from './bookmarks.reducer';
import * as fromDocActions from '../actions/document.action';
import {TestBed} from '@angular/core/testing';
import {Store, StoreModule} from '@ngrx/store';
import {reducers, State} from './reducers';

describe('BookmarksReducer', () => {

  const bookmark = {
    name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
  } as any;

  let store: Store<State>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
      ],
    });
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should start loading  bookmarks', () => {
    const state = fromBookmarks.bookmarksReducer(fromBookmarks.initialBookmarksState, new LoadBookmarks());

    expect(state.bookmarks).toEqual([]);
    expect(state.bookmarkEntities).toEqual({});
    expect(state.editableBookmark).toBeUndefined();
    expect(state.loaded).toBeFalse();
    expect(state.loading).toBeTrue();
  });

  it('should load bookmarks on success', () => {
    const bookmarks = [bookmark];
    const res = { body: bookmarks, status: 200 };
    const state = fromBookmarks.bookmarksReducer(fromBookmarks.initialBookmarksState, new LoadBookmarksSuccess(res));

    expect(state.bookmarks).toEqual(bookmarks);
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should load bookmarks on failure', () => {
    const res = { body: [], status: 404 };
    const state = fromBookmarks.bookmarksReducer(fromBookmarks.initialBookmarksState, new LoadBookmarksFailure(res));

    expect(state.bookmarks).toEqual([]);
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should load created bookmark', () => {
    const state = fromBookmarks.bookmarksReducer(fromBookmarks.initialBookmarksState, new CreateBookmarkSuccess(bookmark));

    expect(state.bookmarkEntities).toEqual({ [bookmark.id]: bookmark });
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should delete bookmark', () => {
    const bookmarksState: fromBookmarks.BookmarksState = {
      bookmarks: [bookmark],
      bookmarkEntities: { [bookmark.id]: bookmark },
      bookmarkPageEntities: { [bookmark.pageNumber]: [bookmark] },
      editableBookmark: undefined,
      loaded: true,
      loading: false
    };
    store.dispatch(new fromDocActions.AddPages([{
      div: {
        offsetHeight: 466.666
      },
      scale: 1,
      rotation: 0,
      id: '1',
      viewportScale: 1.33333
    }]));

    const state = fromBookmarks.bookmarksReducer(bookmarksState, new DeleteBookmarkSuccess([bookmark.id]));
    expect(state.bookmarkEntities).toEqual({});
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });


  it('should update bookmark', () => {
    const bookmarksState: fromBookmarks.BookmarksState = {
      bookmarks: [bookmark],
      bookmarkEntities: { [bookmark.id]: bookmark },
      bookmarkPageEntities: { [bookmark.pageNumber]: [bookmark] },

      editableBookmark: undefined,
      loaded: true,
      loading: false
    };
    bookmark.name = 'updated bookmark';

    const state = fromBookmarks.bookmarksReducer(bookmarksState, new UpdateBookmarkSuccess(bookmark));

    expect(state.bookmarkEntities).toEqual({ [bookmark.id]: bookmark });
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should move bookmark on success', () => {
    const bookmark2 = { ...bookmark, name: 'bookmark 2', id: 'id2', previous: 'id' };
    const bookmarksState: fromBookmarks.BookmarksState = {
      bookmarks: [{ ...bookmark }, bookmark2],
      bookmarkEntities: { [bookmark.id]: { ...bookmark }, [bookmark2.id]: bookmark2 },
      bookmarkPageEntities: { [bookmark.pageNumber]: [bookmark] },
      editableBookmark: undefined,
      loaded: true,
      loading: false
    };
    bookmark.previous = 'id2';
    bookmark2.previous = undefined;

    const state = fromBookmarks.bookmarksReducer(bookmarksState, new MoveBookmarkSuccess([bookmark, bookmark2]));

    expect(state.bookmarkEntities['id'].previous).toEqual('id2');
    expect(state.bookmarkEntities['id2'].previous).toBeUndefined();
  });
});
