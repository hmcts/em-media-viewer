import * as fromActions from '../actions/document.action';

export interface DocumentState {
  documentId: string;
  pages: {[id: string]: DocumentPages};
  loaded: boolean;
  loading: boolean;
}

export interface DocumentPages {
 numberOfPages: number;
 styles: { left: number, height: number, width: number };
 scaleRotation: { scale: string; rotation: string };
}

export const initialDocumentState: DocumentState = {
  documentId: undefined,
  pages: {},
  loading: false,
  loaded: false,
};

export function docReducer (state = initialDocumentState,
                            action: fromActions.DocumentActions): DocumentState {

  switch (action.type) {

    case fromActions.SET_DOCUMENT_ID : {
      const url = action.payload.split('/documents/');
      const documentId = (url.length > 1 ? url[1] : url[0]).replace('/binary', '');
      return {
        ...state,
        documentId
      }
    }

    case fromActions.ADD_PAGES: {
      const payload = action.payload;
      let pages = {};
      payload.forEach(page => {
        const styles = {
          left: page.div['offsetLeft'],
          height: page.div['offsetHeight'],
          width: page.div['offsetWidth']
        };

        const scaleRotation = {
          scale: page.scale,
          rotation: page.rotation
        };

        const p = {
          styles,
          scaleRotation
        };

        pages = {
          ...pages,
          [page.id]: p
        };

      });
      return {
        ...state,
        pages
      };
    }
  }
  return state;
}
export const getDocPages = (state: DocumentState) => state.pages;
export const getDocId = (state: DocumentState) => state.documentId;

