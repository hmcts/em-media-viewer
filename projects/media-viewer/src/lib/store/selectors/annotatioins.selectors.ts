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
    if (pages) {
    return Object.keys(pages).map(key => {
      const styles = pages[key]
      return {
        anno: annoEnt[key] ? annoEnt[key] : null,
        styles
      };
    });
    }
  }
);
