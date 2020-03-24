import * as fromAnnotations from './annotatons.reducer';
import * as fromActions from '../actions/annotations.action';

describe('AnnotationReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromAnnotations;
      const action = {} as any;
      const state = fromAnnotations.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('ADD PAGE action', () => {
    it('should set pages', () => {
      const payload = {
          div: {},
          pageNumber: 3,
          scale: '1',
          rotation: '0'
        }
      const { initialState } = fromAnnotations;
      const action = new fromActions.AddPage(payload);
      const state = fromAnnotations.reducer(initialState, action);
      const pages = {
        numberOfPages: 3,
        styles: {
          left: undefined,
          height: undefined,
          width: undefined
        },
        scaleRotation: {
          scale: '1',
          rotation: '0'
        }
      }

      expect(state.pages).toEqual(pages);
    });
  });

});
