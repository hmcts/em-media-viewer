import * as fromAnnotations from '../actions/annotations.action';
import {AnnotationSet} from '../../annotations/annotation-set/annotation-set.model';

export interface AnnotationSetState {
  annotationSet: AnnotationSet | {};
  comments: {[id: string]: Comment} | {};
  loaded: boolean;
  loading: boolean;
}

export const initialState: AnnotationSetState = {
  annotationSet: {},
  comments: {},
  loading: false,
  loaded: false,
};

export function reducer (
  state = initialState,
  action: fromAnnotations.AnnotationsActions
): AnnotationSetState {
  switch (action.type) {

    case fromAnnotations.LOAD_ANNOTATION_SET: {
      return {
        ...state,
        loading: true
      };
    }
    case fromAnnotations.LOAD_ANNOTATION_SET_SUCCESS: {
      const annotationSet = action.payload
      return {
        ...state,
        annotationSet,
        loading: false,
        loaded: true
      };
    }
  }


  return state;
}

export const getAnnoSet = (state: AnnotationSetState) => state.annotationSet;
export const getComments = (state: AnnotationSetState) => state.comments;

