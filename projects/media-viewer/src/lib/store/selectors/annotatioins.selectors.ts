import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAnnotations from '../reducers/annotatons.reducer'

export const getAnnotationsSetState = createSelector(
  fromFeature.getAnnoSetState,
  (state: fromAnnotations.AnnotationSetState) =>  state
);

export const getAnnotationSet = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getAnnoSet
);

export const getAnnComments = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getComments
);

export const getCommentsArray = createSelector(
  getAnnComments,
  (comments) => Object.keys(comments).map(key => comments[key])
);

export const getAnnoEntities = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getAnnoEnt
);

export const getAnnoPages = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getPages
);

export const getAnnoPerPage = createSelector(
  getAnnoPages,
  getAnnoEntities,
  (pages, annoEnt) => {
    if (pages && pages.numberOfPages) {
      const arr = [];
      for (let i = 1; i <= pages.numberOfPages; i++) {
          arr.push({
            anno: annoEnt[i] ? annoEnt[i] : [],
            styles: pages.styles
          });
      }
      return arr;
    }
  }
);

