import * as fromActions from '../actions/document.action';

import { PdfPosition } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
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

    case fromActions.SAVE_ROTATION_SUCCESS: {
      const metadata = action.payload;
      const rotation = metadata.body.rotationAngle;
      return {
        ...state,
        rotation
      };
    }

    case fromActions.LOAD_ROTATION_SUCCESS: {
        const metadata = action.payload;
        const rotation = metadata.body.rotationAngle;
        return {
          ...state,
          rotation
        };
    }

    case fromActions.SET_DOCUMENT_ID : {
      const url = action.payload.split('/documents/');
      const documentId = (url.length > 1 ? url[1] : url[0]).replace('/binary', '');
      return {
        ...state,
        documentId
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
          (pageHeight !== page.div['offsetHeight'] || pageWidth !== page.div['offsetWidth'])) {
            hasDifferentPageSize = true;
        } else {
          pageHeight = page.div['offsetHeight'];
          pageWidth = page.div['offsetWidth'];
        }
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
export const getConvertedDocument = (state: DocumentState) => state.convertedDocument;
