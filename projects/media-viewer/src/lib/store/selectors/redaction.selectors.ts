import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers/reducers';
import * as fromRedactions from '../reducers/redaction.reducer';
import { getDocumentIdSetId} from './annotations.selectors';
import * as fromDocument from './document.selectors';

export const getRedactionState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.redactions
);

export const getRedactionPages = createSelector(
  getRedactionState,
  fromRedactions.getPageEnt
);

export const getSelected = createSelector(
  getRedactionState,
  fromRedactions.getSelectedRedaction
);

export const getRedactedDocumentInfo = createSelector(
  getRedactionState,
  fromRedactions.getRedactedDocInfo
);

export const getRedactionEnt = createSelector(
  getRedactionState,
  fromRedactions.getRedactionEnt
);

export const getRedactionArray = createSelector(
  getRedactionEnt,
  getDocumentIdSetId,
  (ent, docSetId) => {
    return {
      redactions: Object.keys(ent).map(key => ent[key]),
      documentId: docSetId.documentId
    }
  }
);

export const getRedactionsPerPage = createSelector(
  fromDocument.getPages,
  getRedactionPages,
  (pages, pageEnt) => {
    if (pages && pages.numberOfPages && pageEnt) {
      const arr = [];
      for (let i = 1; i <= pages.numberOfPages; i++) {
        arr.push({
          anno: pageEnt[i] ? pageEnt[i] : [],
          styles: pages.styles
        });
      }
      return arr;
    }
  }
);

