import * as fromDocument from './document.reducer';
import * as fromActions from '../actions/document.actions';
import { ClearConvertDocUrl, ConvertFailure, ConvertSuccess } from '../actions/document.actions';
import { DocumentState } from './document.reducer';

describe('DocumentReducer', () => {

  const documentState: DocumentState = {
    convertedDocument: { url: 'url', error: undefined },
    documentId: '',
    pdfPosition: undefined,
    rotation: undefined,
    rotationLoaded: undefined,
    pages: undefined,
    hasDifferentPageSize: false,
    loaded: true,
    loading: false
  };

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
        id: '1',
        viewportScale: 1.33333
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
        },
        viewportScale: 1.33333
      }
    };
    expect(state.pages).toEqual(pages);
  });

  it('should convert document', function () {
    const url = 'new url';

    const state = fromDocument.docReducer(documentState, new ConvertSuccess(url));

    expect(state.convertedDocument).toEqual({ url: url, error: undefined });
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should fail to convert document', function () {
    const error = 'error';

    const state = fromDocument.docReducer(documentState, new ConvertFailure(error));

    expect(state.convertedDocument).toEqual({ url: undefined, error: error });
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });

  it('should clear doc url', function () {
    const state = fromDocument.docReducer(documentState, new ClearConvertDocUrl());

    expect(state.convertedDocument).toEqual(undefined);
    expect(state.loaded).toBeTrue();
    expect(state.loading).toBeFalse();
  });
});
