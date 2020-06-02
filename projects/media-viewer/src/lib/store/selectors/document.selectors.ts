import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers/reducers';
import * as fromDocument from '../reducers/document.reducer';

export const getDocumentState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.document
);

export const getPages = createSelector(
  getDocumentState,
  fromDocument.getDocPages
);

export const getDocumentId = createSelector(
  getDocumentState,
  fromDocument.getDocId
);

export const getPageDifference = createSelector(
  getDocumentState,
  fromDocument.getHasDifferentPageSizes
);



