import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers/reducers';
import * as fromDocument from '../reducers/document.reducer';

export const getDocumentState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) => state.document
);

export const getPages = createSelector(
  getDocumentState,
  fromDocument.getDocPages
);

export const getPageList = createSelector(
  getPages,
  (pages) => Object.values(pages)
);

export const getDocumentId = createSelector(
  getDocumentState,
  fromDocument.getDocId
);

export const getPdfPosition = createSelector(
  getDocumentState,
  fromDocument.getPdfPos
);

export const getPageDifference = createSelector(
  getDocumentState,
  fromDocument.getHasDifferentPageSizes
);

export const getConvertedDocument = createSelector(
  getDocumentState,
  fromDocument.getConvertedDocument
);

export const getRotation = createSelector(
  getDocumentState,
  fromDocument.getRotation
);

export const rotationLoaded = createSelector(
  getDocumentState,
  fromDocument.rotationLoaded
);
