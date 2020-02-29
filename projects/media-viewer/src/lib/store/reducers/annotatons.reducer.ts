import * as fromAnnotations from '../actions/annotations.action';
import {AnnotationSet} from '../../annotations/annotation-set/annotation-set.model';

export interface AnnotationSetState {
  annotationSet: AnnotationSet | null;
  comments: {[id: string]: Comment} | null;
  loaded: boolean;
  loading: boolean;
}

export const initialState: AnnotationSetState = {
  annotationSet: null,
  comments: null,
  loading: false,
  loaded: false,
};

export function reducer (
  state = initialState,
  action: fromAnnotations.AnnotationsActions
): AnnotationSetState {
  switch (action.type) {

    case fromAnnotations.LOAD_ANNOTATION_SET: {
      // const userList = [];
      // return 'test'
    }
  }


  return state;
}

export const getAnnotationSet = (state: AnnotationSetState) => state.annotationSet;
export const getComments = (state: AnnotationSetState) => state.comments;

