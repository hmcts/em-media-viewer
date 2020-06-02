import * as fromDocument from './document.reducer';
import * as fromActions from '../actions/document.action';

describe('DocumentReducer', () => {

    it('should return the default state', () => {
      const { initialDocumentState } = fromDocument;
      const action = {} as any;
      const state = fromDocument.docReducer(undefined, action);

      expect(state).toBe(initialDocumentState);
    });

    it('should set pages after ADD PAGE action', () => {
      const payload = [
        {
          div: {},
          scale: 1,
          rotation: 0,
          id: '1'
        }];
      const { initialDocumentState } = fromDocument;
      const action = new fromActions.AddPages(payload);
      const state = fromDocument.docReducer(initialDocumentState, action);
      const pages: any = {
        '1' : {
          styles: {
            left: undefined,
            height: undefined,
            width: undefined
          },
          scaleRotation: {
            scale: 1,
            rotation: 0
          }
        }
      }
      expect(state.pages).toEqual(pages);
    });
});
