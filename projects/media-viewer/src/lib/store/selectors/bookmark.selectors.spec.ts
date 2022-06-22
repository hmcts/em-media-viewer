import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, State } from '../reducers/reducers';

import * as fromSelectors from './bookmark.selectors';
import * as fromActions from '../actions/bookmark.actions';
import * as fromDocActions from '../actions/document.actions';

describe('Bookmarks selectors', () => {

  let store: Store<State>;
  const bookmark = {
    name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
  } as any;
  const page = {
    div: {
      scrollHeight: 466.666
    },
    scale: 1,
    rotation: 0,
    id: '1',
    viewportScale: 1.33333
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
      ],
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should return bookmark info', (done) => {
    const bookmark2 = { ...bookmark, name: 'bookmark 2', id: 'id2', previous: 'id' };
    const payload: any = { pageNumber: 1, left: 100, top: 200 };
    store.dispatch(new fromDocActions.PdfPositionUpdate(payload));
    store.dispatch(new fromDocActions.SetDocumentId('documentId'));
    store.dispatch(new fromActions.LoadBookmarksSuccess({ body: [bookmark, bookmark2], status: 200 }));

    store.dispatch(new fromDocActions.AddPages([page]));

    store.pipe(select(fromSelectors.getBookmarkInfo)).subscribe(value => {

      // Update the test to include secure mode ('documentId' -> '/documentsv2/documentId')
      const expected = { pageNumber: 0, xCoordinate: 100, yCoordinate: 200, previous: 'id2', documentId: '/documentsv2/documentId' };
      expect(value).toEqual(expected);
      done();
    });
  });

  it('should return pages of bookmarks', (done) => {
    store.dispatch(new fromDocActions.AddPages([page]));

    store.pipe(select(fromSelectors.getBookmarksPerPage)).subscribe(value => {
      const expected = [{ bookmark: [], styles: { left: undefined, height: 466.666, width: undefined }}];

      expect(value).toEqual(expected);
      done();
    });
  });
});
