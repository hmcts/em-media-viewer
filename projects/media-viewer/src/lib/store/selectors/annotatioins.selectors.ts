import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAnnotations from '../reducers/annotatons.reducer';

export const getAnnotationsSetState = createSelector(
  fromFeature.getAnnoSetState,
  (state: fromAnnotations.AnnotationSetState) =>  state
);

export const getAnnotationEntities = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getAnnoEnt
);

export const getSet = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getAnnoSet
);

export const getDocumentIdSetId = createSelector(
  getSet,
  (annoSet) => {
    return {
      documentId: annoSet.documentId,
      // annotationSetId: annoSet.annotationSetId
    }}
);


export const getAnnotationSet = createSelector(
  getAnnotationEntities,
  getSet,
  (entities, set) => {
    return {
      ...set,
      annotations: Object.keys(entities).map(key => entities[key])
    };
  }
);

export const getSelectedAnnotation = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getSelectedAnno
);

export const getAnnComments = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getComments
);


export const getAnnoEntities = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getAnnoPageEnt
);

export const getAnnoPages = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getPages
);

export const getComponentSearchQueries = createSelector(
  getAnnotationsSetState,
  fromAnnotations.commentSearchQ
);

export const getComponentSearchText = createSelector(
  getComponentSearchQueries,
  (queries) => queries.commentSearch
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

export const getCommentsArray = createSelector(
  getAnnComments,
  getAnnoPages,
  getAnnotationEntities,
  (comments, pages, annoEnt) => {
    const pageHeight = pages.styles.height;
    if (comments && pageHeight && annoEnt) {
      return Object.keys(comments).map(key => {
        const page = annoEnt[key].page;
        return {
          ...comments[key],
          page,
          pageHeight
        }
      });
    }
  }
);
