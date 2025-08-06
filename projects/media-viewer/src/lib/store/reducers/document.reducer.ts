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
      // we store the first page, as this has been rendered we can use this to get the rounding value
      const pageNumberInput = document.getElementById('pageNumber') as HTMLInputElement;
      const pageIndex = pageNumberInput?.value ? parseInt(pageNumberInput.value, 10) - 1 : 0;
      console.log('pageIndex', pageIndex);
      const loadedPage = payload[pageIndex]?.div['attributes']?.style?.value ?? '';
      payload.forEach(page => {
        const sizingValue = page.div?.['attributes']?.style?.value ?? '';
        const widthMatch = sizingValue.match(/width:\s*round\(down,\s*var\(--scale-factor\)\s*\*\s*([\d.]+)px,.*var\(--scale-round-x, ([\d.]+)px\)\)/);
        const heightMatch = sizingValue.match(/height:\s*round\(down,\s*var\(--scale-factor\)\s*\*\s*([\d.]+)px,.*var\(--scale-round-y, ([\d.]+)px\)\)/);
        const scaleRoundXMatch = loadedPage.match(/--scale-round-x:\s*([\d.]+)px/);
        const scaleRoundYMatch = loadedPage.match(/--scale-round-y:\s*([\d.]+)px/);
        const scaleFactor = page.viewportScale ?? 1;
        const scaleRoundX = scaleRoundXMatch ? parseFloat(scaleRoundXMatch[1]) : 1;
        const scaleRoundY = scaleRoundYMatch ? parseFloat(scaleRoundYMatch[1]) : 1;
        const baseWidth = widthMatch ? parseFloat(widthMatch[1]) : undefined;
        const baseHeight = heightMatch ? parseFloat(heightMatch[1]) : undefined;
        function roundDown(value: number, step: number): number {
          return Math.floor(value / step) * step;
        }
        const computedWidth = baseWidth !== undefined
          ? roundDown(scaleFactor * baseWidth, scaleRoundX)
          : page.div['clientWidth'];
        const computedHeight = baseHeight !== undefined
          ? roundDown(scaleFactor * baseHeight, scaleRoundY)
          : page.div['clientHeight'];
        console.log(computedHeight, computedWidth)

        if (!hasDifferentPageSize && pageHeight && pageWidth &&
          (pageHeight !== computedHeight || pageWidth !== computedWidth)) {
          hasDifferentPageSize = true;
        } else {
          pageHeight = computedHeight;
          pageWidth = computedWidth;
        }
        const styles = {
          left: page.div['offsetLeft'],
          height: computedHeight,
          width: computedWidth
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
