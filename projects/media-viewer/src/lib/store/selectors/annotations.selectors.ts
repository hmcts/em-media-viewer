import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers/reducers';
import * as fromAnnotations from '../reducers/annotations.reducer';
import * as fromTags from './tags.selectors';
import * as fromDocument from './document.selectors';
import {StoreUtils} from '../store-utils';
import * as moment_ from 'moment-timezone';
export const getAnnotationsSetState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.annotations
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
      annotationSetId: annoSet.id
    };
  }
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


export const getPageEntities = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getAnnoPageEnt
);

export const getComponentSearchQueries = createSelector(
  getAnnotationsSetState,
  fromAnnotations.commentSearchQ
);

export const getComponentSearchText = createSelector(
  getComponentSearchQueries,
  (queries) => queries.commentSearch
);

export const getCommentSummaryFilters = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getSummaryFilters
);

export const getAnnoPerPage = createSelector(
  fromDocument.getPages,
  getPageEntities,
  fromTags.getFilteredPageEntities,
  (pages, pageEnt, filteredPageEnt) => {
    const isFiltered: boolean = !!Object.keys(filteredPageEnt).length;
    const entities = isFiltered ? filteredPageEnt : pageEnt;
    if (pages) {
      const arr = [];
      Object.keys(pages).forEach(key => {
        arr.push({
          anno: entities[key] ? entities[key] : [],
          styles: pages[key].styles
        });
      });
      return arr;
    }
  }
);

export const getCommentsArray = createSelector(
  getAnnComments,
  fromDocument.getPages,
  getAnnotationEntities,
  fromTags.getTagFiltered,
  (comments, pages, annoEnt, filtered) => {
    if (comments && annoEnt && pages[1]) {
        const isFiltered: boolean = !!Object.keys(filtered).length;
        const com = isFiltered ? filtered : comments;
        return Object.keys(com).map(key => {
          const page = annoEnt[key].page;
          return {
            ...comments[key],
            page,
            pages
          };
        });
    }
  }
);

export const getCommentSummary = createSelector(
  getCommentsArray,
  getCommentSummaryFilters,
  (commentSummary = [], filters) => {
    const comments = StoreUtils.filterCommentsSummary(commentSummary, filters.filters);
    if (comments.length) {
      return comments.map((comment) => {
        const moment = moment_;
        return {
          page: comment.page,
          user: comment.createdByDetails.forename.concat(' ').concat(comment.createdByDetails.surname),
          date: moment(comment.lastModifiedDate).format('D MMMM YYYY'),
          tags: comment.tags,
          comment: comment.content
        };
      });
    }
    return [''];
  }
);


export const getFilteredAnnotations = createSelector(
  getAnnotationEntities,
  fromTags.getTagFiltered,
  (annoEnt, filters) => {
    const isFiltered: boolean = !!Object.keys(filters).length;
    const anno = isFiltered ? filters : annoEnt;
    return Object.keys(anno).map(key => annoEnt[key])
      .filter(annotation => annotation.comments && annotation.comments.length > 0);
  }
);


