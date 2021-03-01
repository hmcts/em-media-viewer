import * as fromActions from '../actions/document.actions';

export interface DocumentState {
  convertedDocument: {
    url: string;
    error: string;
  };
  documentId: string;
  pdfPosition: PdfPosition;
  pages: {[id: string]: DocumentPages};
  hasDifferentPageSize: boolean;
  rotation: number;
  rotationLoaded: boolean;
  loaded: boolean;
  loading: boolean;
}

export interface DocumentPages {
 numberOfPages: number;
 styles: { left: number, height: number, width: number };
 scaleRotation: { scale: string; rotation: string };
 viewportScale: number;
}

export interface PdfPosition {
  pageNumber: number;
  scale: number;
  top: number;
  left: number;
  rotation: number;
}

export const initialDocumentState: DocumentState = {
  convertedDocument: undefined,
  documentId: undefined,
  pdfPosition: undefined,
  pages: {},
  hasDifferentPageSize: false,
  rotation: undefined,
  rotationLoaded: false,
  loading: false,
  loaded: false
};

export function docReducer (state = initialDocumentState,
                            action: fromActions.DocumentActions): DocumentState {

  switch (action.type) {

    case fromActions.CONVERT_SUCCESS: {
      const convertedDocument = {
        url: action.payload,
        error: undefined
      };
      return {
        ...state,
        convertedDocument
      };
    }

    case fromActions.CONVERT_FAIL: {
      const convertedDocument = {
        url: undefined,
        error: action.payload
      };
      return {
        ...state,
        convertedDocument
      };
    }

    case fromActions.CLEAR_CONVERT_DOC_URL: {
      const convertedDocument = undefined;
      return {
        ...state,
        convertedDocument
      };
    }

    case fromActions.LOAD_ROTATION: {
      return {
        ...state,
        rotationLoaded: false
      };
    }

    case fromActions.LOAD_ROTATION_SUCCESS: {
      const metadata = action.payload;
      const rotation = metadata ? metadata.rotationAngle : 0;
      return {
        ...state,
        rotation,
        rotationLoaded: true
      };
    }

    case fromActions.LOAD_ROTATION_FAIL: {
      return {
        ...state,
        rotation: 0,
        rotationLoaded: true
      };
    }

    case fromActions.SAVE_ROTATION_SUCCESS: {
      const metadata = action.payload;
      const rotation = metadata.rotationAngle;
      return {
        ...state,
        rotation
      };
    }

    case fromActions.SET_DOCUMENT_ID : {
      return {
        ...state,
        documentId: action.payload
      };
    }

    case fromActions.ADD_PAGES: {
      const payload = action.payload;
      let pages = {};
      let pageHeight;
      let pageWidth;
      let hasDifferentPageSize = state.hasDifferentPageSize;
      payload.forEach(page => {
        if (!hasDifferentPageSize && pageHeight && pageWidth &&
          (pageHeight !== page.div['scrollHeight'] || pageWidth !== page.div['scrollWidth'])) {
            hasDifferentPageSize = true;
        } else {
          pageHeight = page.div['scrollHeight'];
          pageWidth = page.div['scrollWidth'];
        }
        const styles = {
          left: page.div['offsetLeft'],
          height: page.div['scrollHeight'],
          width: page.div['scrollWidth']
        };

        const scaleRotation = {
          scale: page.scale,
          rotation: page.rotation
        };

        const p = {
          styles,
          scaleRotation,
          viewportScale: page.viewportScale
        };

        pages = {
          ...pages,
          [page.id]: p
        };

      });
      return {
        ...state,
        pages,
        hasDifferentPageSize
      };
    }

    case fromActions.POSITION_UPDATED: {
      const pdfPosition = action.payload;
      return {
        ...state,
        pdfPosition
      };
    }
  }
  return state;
}
export const getDocPages = (state: DocumentState) => state.pages;
export const getDocId = (state: DocumentState) => state.documentId;
export const getPdfPos = (state: DocumentState) => state.pdfPosition;
export const getHasDifferentPageSizes = (state: DocumentState) => state.hasDifferentPageSize;
export const getRotation = (state: DocumentState) => state.rotation;
export const rotationLoaded = (state: DocumentState) => state.rotationLoaded;
export const getConvertedDocument = (state: DocumentState) => state.convertedDocument;
