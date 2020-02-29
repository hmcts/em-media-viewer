import * as fromAnnotations from '../actions/annotations.action';
import {AnnotationSet} from '../../annotations/annotation-set/annotation-set.model';

export interface AnnotationSetState {
  annotationSetPdf: AnnotationSet | null;
  annotationSetImage: AnnotationSet | null;
  comments: {[id: string]: Comment} | null;
  loadedPdf: boolean;
  loadedImg: boolean;
  loadingPdf: boolean;
  loadingImg: boolean;
}

export const initialState: AnnotationSetState = {
  annotationSetPdf: null,
  annotationSetImage: null,
  comments: null,
  loadingPdf: false,
  loadedImg: false,
  loadedPdf: false,
  loadingImg: false
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

export const getAnnoPdf = (state: AnnotationSetState) => state.annotationSetPdf;
export const getAnnoImg = (state: AnnotationSetState) => state.annotationSetImage;
export const getComments = (state: AnnotationSetState) => state.comments;

