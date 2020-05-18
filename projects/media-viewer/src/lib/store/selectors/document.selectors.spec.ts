import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, State } from '../reducers/reducers';

import * as fromSelectors from './document.selectors';
import * as fromActions from '../actions/document.action';

describe('Document selectors', () => {
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

  describe('getPages', () => {
    it('should return document pages', () => {
      let result;
      store.pipe(select(fromSelectors.getPages)).subscribe(value => {
        result = value;
      });
      const payload: any = {
        div: {},
        pageNumber: 1,
        scale: 1,
        rotation: 0
      };
      store.dispatch(new fromActions.AddPage(payload));
      const expected = {
        numberOfPages: 1,
        styles: {
          left: undefined,
          height: undefined,
          width: undefined
        },
        scaleRotation: {
          scale: 1,
          rotation: 0
        }
      };
      expect(result).toEqual(expected);
    });
  });

});
