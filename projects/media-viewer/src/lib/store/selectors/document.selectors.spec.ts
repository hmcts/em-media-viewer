import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, State } from '../reducers/reducers';

import * as fromSelectors from './document.selectors';
import * as fromActions from '../actions/document.actions';

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
      const payload: any = [{
        div: {},
        scale: 1,
        rotation: 0,
        id: '1',
        viewportScale: 1.33333
      }];
      store.dispatch(new fromActions.AddPages(payload));
      const expected = {
        '1': {
          styles: {
            left: undefined,
            height: undefined,
            width: undefined
          },
          scaleRotation: {
            scale: 1,
            rotation: 0
          },
          viewportScale: 1.33333
        }
      };
      expect(result).toEqual(expected);
    });
  });

});
