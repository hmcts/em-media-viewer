import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, State } from '../reducers/reducers';

import * as fromSelectors from './bookmarks.selectors';
import * as fromActions from '../actions/bookmarks.action';
import * as fromDocActions from '../actions/document.action';
import { take } from 'rxjs/operators';


describe('Bookmark selectors', () => {
  let store: Store<State>;
  const bookmark = {
    name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
  } as any;
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

  it('should return bookmark info', () => {
    let result;
    const bookmark2 = { ...bookmark, name: 'bookmark 2', id: 'id2', previous: 'id' };
    const payload: any = { pageNumber: 1, left: 100, top: 200 };
    store.dispatch(new fromDocActions.PdfPositionUpdate(payload));
    store.dispatch(new fromDocActions.SetDocumentId('documentId'));
    store.dispatch(new fromActions.LoadBookmarksSuccess({ body: [bookmark, bookmark2], status: 200 }));

    store.pipe(select(fromSelectors.getBookmarkInfo), take(1)).subscribe(value => {
      result = value;
    });

    const expected = { pageNumber: 0, xCoordinate: 100, yCoordinate: 200, previous: 'id2', documentId: 'documentId' };
    expect(result).toEqual(expected);
  });

  describe('getBookmarksPerPage', () => {
    it('should return pages of bookmarks', () => {
      store.dispatch(new fromDocActions.AddPages([{
        div: {},
        scale: 1,
        rotation: 0,
        id: '1'
      }]));

      let result;
      store.pipe(select(fromSelectors.getBookmarksPerPage)).subscribe(value => {
        result = value;
      });
      const payload: any = {
        id: '1',
        documentId: 'uuid',
        name: 'bookmark1',
        pageNumber: 0,
        xCoordinate: 100,
        yCoordinate: -120
      };
      store.dispatch(new fromActions.CreateBookmark(payload));
      const expected = [ { bookmark: [  ], styles: { left: undefined, height: undefined, width: undefined } } ];
      expect(result).toEqual(expected);
    });
  });

});
