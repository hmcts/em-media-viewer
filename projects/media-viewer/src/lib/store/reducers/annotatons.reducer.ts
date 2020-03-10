import * as fromAnnotations from '../actions/annotations.action';
import {AnnotationSet} from '../../annotations/annotation-set/annotation-set.model';
import {Annotation} from '../../annotations/annotation-set/annotation-view/annotation.model';

export interface AnnotationSetState {
  annotationSet: any; // todo add type
  annotationEntities: {[id: string]: Annotation[]};
  commentEntities: {[id: string]: Comment} | {};
  pages: { numberOfPages: number; styles: any }; // todo add proper typing
  loaded: boolean;
  loading: boolean;
}

export const initialState: AnnotationSetState = {
  annotationSet: {},
  commentEntities: {},
  annotationEntities: {},
  pages: {
    numberOfPages: 0,
    styles: {}
  },
  loading: false,
  loaded: false,
};

export function reducer (
  state = initialState,
  action: fromAnnotations.AnnotationsActions
): AnnotationSetState {
  switch (action.type) {

    case fromAnnotations.ADD_PAGE: {
      const payload = action.payload
      const  numberOfPages = (state.pages.numberOfPages <= payload.pageNumber) ?
        payload.pageNumber : state.pages.numberOfPages;
      const styles = {
        'left': payload.div['offsetLeft'],
        'height': payload.div['offsetHeight'],
        'width': payload.div['offsetWidth']
      };

      const page = {
        numberOfPages,
        styles
      };

      const pages = {
        ...page
      };
      return {
        ...state,
        pages
      };
    }

    case fromAnnotations.LOAD_ANNOTATION_SET: {
      return {
        ...state,
        annotationSet: {},
        commentEntities: {},
        loading: true
      };
    }
    case fromAnnotations.LOAD_ANNOTATION_SET_SUCCESS: {
      const annotationSet = action.payload;
      const comments = annotationSet.annotations
        .reduce(
          (commentEntities: { [id: string]: Annotation }, annotation: Annotation) => {
            if (annotation.comments.length) {
              return {
                ...commentEntities,
                [annotation.id]: annotation.comments[0]
              };
            }
            return {
              ...commentEntities
            };
          }, {});

      const annotationEntities = annotationSet.annotations.reduce((h, obj) =>
        Object.assign(h, { [obj.page]:( h[obj.page] || [] ).concat(obj) }), {});

      return {
        ...state,
        annotationSet,
        annotationEntities,
        commentEntities: comments,
        loading: false,
        loaded: true
      };
    }

    case fromAnnotations.SAVE_ANNOTATION_SUCCESS: {
      const annotations = [
        ...state.annotationSet.annotations,
        ...action.payload
      ];
      const annotationSet = {
        ...state.annotationSet,
        annotations
      };

      const annotationEntities = annotationSet.annotations.reduce((h, obj) =>
        Object.assign(h, { [obj.page]:( h[obj.page] || [] ).concat(obj) }), {});
      const comments = annotationSet.annotations
        .reduce(
          (commentEntities: { [id: string]: Annotation }, annotation: Annotation) => {
            console.log(annotation)
            if (annotation.comments.length) {
              return {
                ...commentEntities,
                [annotation.id]: annotation.comments[0]
              };
            }
            return {
              ...commentEntities
            };
          }, {});

      return {
        ...state,
        annotationSet,
        annotationEntities,
        commentEntities: comments,
        loading: false,
        loaded: true
      };
    }

    case fromAnnotations.ADD_OR_EDIT_COMMENT: {
      const comment = {
        [action.payload.annotationId]: action.payload
      };
      const comments = {
        ...state.commentEntities,
        ...comment
      };
      return {
        ...state,
        commentEntities: comments
      };
    }

  }


  return state;
}

export const getAnnoSet = (state: AnnotationSetState) => state.annotationSet;
export const getComments = (state: AnnotationSetState) => state.commentEntities;
export const getAnnoEnt = (state: AnnotationSetState) => state.annotationEntities;
export const getPages = (state: AnnotationSetState) => state.pages;

