import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromReductions from '../reducers/reduction.reducer';
import {getAnnoPages, getDocumentIdSetId} from './annotations.selectors';

export const getTagsRootState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.reductions
);

export const getReductionPages = createSelector(
  getTagsRootState,
  fromReductions.getPageEnt
);

export const getSelected = createSelector(
  getTagsRootState,
  fromReductions.getSelectedRedaction
);

export const getRedactionEnt = createSelector(
  getTagsRootState,
  fromReductions.getReductionEnt
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

export const getAnnoPerPage = createSelector(
  getAnnoPages,
  getReductionPages,
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

