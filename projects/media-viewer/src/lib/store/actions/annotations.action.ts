import { Action } from '@ngrx/store';

export const LOAD_ANNOTATION_SET = '[Annotations] Load Annotation Set';
export const LOAD_ANNOTATION_SET_SUCCESS = '[Annotations] Load Annotation Set Success';
export const LOAD_ANNOTATION_SET_FAIL = '[Annotations] Load Annotation Set Fail';


export class LoadAnnotationSet implements Action {
  readonly type = LOAD_ANNOTATION_SET;
  constructor(public payload: string) { }
}

export class LoadAnnotationSetSucess implements Action {
  readonly type = LOAD_ANNOTATION_SET_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadAnnotationSetFail implements Action {
  readonly type = LOAD_ANNOTATION_SET_FAIL;
  constructor(public payload: any) { }
}


export type AnnotationsActions =
  | LoadAnnotationSet
  | LoadAnnotationSetSucess
  | LoadAnnotationSetFail;
