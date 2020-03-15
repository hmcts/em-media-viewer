import * as fromAnnotations from '../actions/annotations.action';
import {Annotation} from '../../annotations/annotation-set/annotation-view/annotation.model';
import {StoreUtils} from '../store-utils';
import {getAnnotationEntities} from '../selectors';

export interface AnnotationSetState {
  annotationSet: any; // todo add type to be removed
  annotationEntities: {[id: string]: any}; // todo add type
  annotationPageEntities: {[id: string]: Annotation[]};
  commentEntities: {[id: string]: Comment} | {};
  pages: { numberOfPages: number; styles: any; scaleRotation: object }; // todo add proper typing
  loaded: boolean;
  loading: boolean;
}

export const initialState: AnnotationSetState = {
  annotationSet: {},
  annotationEntities: {},
  commentEntities: {},
  annotationPageEntities: {},
  pages: {
    numberOfPages: 0,
    styles: {},
    scaleRotation: {}
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
      const payload = action.payload;
      const  numberOfPages = (state.pages.numberOfPages <= payload.pageNumber) ?
        payload.pageNumber : state.pages.numberOfPages;
      const styles = {
        'left': payload.div['offsetLeft'],
        'height': payload.div['offsetHeight'],
        'width': payload.div['offsetWidth']
      };
      const scaleRotation = {
        scale: payload.scale,
        rotation: payload.rotation
      };
      // const annotationPageEntities = StoreUtils.scaleRotateAnno(state.annotationSet.annotations, scaleRotation, styles); // todo grab this from entities
      const page = {
        numberOfPages,
        styles,
        scaleRotation
      };

      const pages = {
        ...page
      };
      return {
        ...state,
        // annotationPageEntities,
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
      const annotationEntities = StoreUtils.generateAnnotationEntities(annotationSet.annotations);
      const annotationPageEntities = StoreUtils.generatePageEntities(annotationSet.annotations);
      const commentEntities = StoreUtils.generateCommentsEntities(annotationSet.annotations);
      return {
        ...state,
        annotationSet,
        annotationEntities,
        annotationPageEntities,
        commentEntities,
        loading: false,
        loaded: true
      };
    }

    case fromAnnotations.SAVE_ANNOTATION_SUCCESS: {
      const anno = action.payload;
      const annEntities = {
        ...state.annotationEntities,
        [anno.id]: anno
      };
      const annotArray = Object.keys(annEntities).map(key => annEntities[key]);
      const annotationEntities = StoreUtils.generateAnnotationEntities(annotArray);
      const annotationPageEntities = StoreUtils.generatePageEntities(annotArray);
      const commentEntities = StoreUtils.generateCommentsEntities(annotArray);

      return {
        ...state,
        annotationEntities,
        annotationPageEntities,
        commentEntities,
        loading: false,
        loaded: true
      };
    }

    case fromAnnotations.DELETE_ANNOTATION_SUCCESS: {
      const id = action.payload;
      const page = state.annotationEntities[id].page;
      const annotationEntities = {
        ...state.annotationEntities
      }
      delete annotationEntities[id];
      const pageAnnotationsRemoved = [
        ...state.annotationPageEntities[page].filter(anno => anno.id !== id)
      ];
      const annotationPageEntities = {
        ...state.annotationPageEntities,
        [page]: pageAnnotationsRemoved
      };
      const commentEntities = {
        ...state.commentEntities
      };
      if(state.commentEntities[id]) {
        delete commentEntities[id];
      }
      return {
        ...state,
        annotationEntities,
        annotationPageEntities,
        commentEntities
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
export const getAnnoPageEnt = (state: AnnotationSetState) => state.annotationPageEntities;
export const getAnnoEnt = (state: AnnotationSetState) => state.annotationEntities;
export const getPages = (state: AnnotationSetState) => state.pages;

