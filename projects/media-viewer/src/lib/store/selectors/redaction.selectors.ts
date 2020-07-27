import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers/reducers';
import * as fromRedactions from '../reducers/redaction.reducer';
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
  fromDocument.getDocumentId,
  (ent, documentId) => {
    const redactions = Object.keys(ent).map(key => ent[key]);
    return { redactions, documentId };
  }
);

export const getRedactionsPerPage = createSelector(
  fromDocument.getPages,
  getRedactionPages,
  (pages, pageEnt) => {
    if (pages && pageEnt) {
      const arr = [];
      Object.keys(pages).forEach(key => {
        arr.push({
          anno: pageEnt[key] ? pageEnt[key] : [],
          styles: pages[key].styles
        });
      });

      return arr;
    }
  }
);

