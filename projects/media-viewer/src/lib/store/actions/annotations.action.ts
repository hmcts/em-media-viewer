import { Action } from '@ngrx/store';
import {Annotation} from '../../annotations/annotation-set/annotation-view/annotation.model';
import {SelectionAnnotation} from '../../annotations/models/event-select.model';
import {AnnotationSet} from '../../annotations/annotation-set/annotation-set.model';

export const LOAD_ANNOTATION_SET = '[Annotations] Load Annotation Set';
export const LOAD_ANNOTATION_SET_SUCCESS = '[Annotations] Load Annotation Set Success';
export const LOAD_ANNOTATION_SET_FAIL = '[Annotations] Load Annotation Set Fail';

export const SAVE_ANNOTATION = '[Annotations] Save Annotation';
export const SAVE_ANNOTATION_SUCCESS = '[Annotations] Save Annotation Success';
export const SAVE_ANNOTATION_FAIL = '[Annotations] Save Annotation Fail';
export const ADD_OR_EDIT_COMMENT = '[Annotations] Add or Edit Comment';

export const DELETE_ANNOTATION = '[Annotations] Delete Annotation';
export const DELETE_ANNOTATION_SUCCESS = '[Annotations] Delete Annotation Success';
export const DELETE_ANNOTATION_FAIL = '[Annotations] Delete Annotation Fail';

export const SELECT_ANNOTATION  = '[Annotations] Select Annotation';
export const SEARCH_COMMENT  = '[Comments] Search Comments';
export const APPLY_COMMENT_SUMMARY_FILTER  = '[Comments] Apply Comment Summary Filter';

export class LoadAnnotationSet implements Action {
  readonly type = LOAD_ANNOTATION_SET;
  constructor(public payload: string) { }
}

export class LoadAnnotationSetSucess implements Action {
  readonly type = LOAD_ANNOTATION_SET_SUCCESS;
  constructor(public payload: AnnotationSet) { }
}

export class LoadAnnotationSetFail implements Action {
  readonly type = LOAD_ANNOTATION_SET_FAIL;
  constructor(public payload: any) { }
}

export class SaveAnnotation implements Action {
  readonly type = SAVE_ANNOTATION;
  constructor(public payload: any) { }
}

export class SaveAnnotationSuccess implements Action {
  readonly type = SAVE_ANNOTATION_SUCCESS;
  constructor(public payload: any) { }
}

export class SaveAnnotationFail implements Action {
  readonly type = SAVE_ANNOTATION_FAIL;
  constructor(public payload: Error) { }
}

export class AddOrEditComment implements Action {
  readonly type = ADD_OR_EDIT_COMMENT;
  constructor(public payload: Annotation) { }
}

export class DeleteAnnotation implements Action {
  readonly type = DELETE_ANNOTATION;
  constructor(public payload: string) { }
}

export class DeleteAnnotationSuccess implements Action {
  readonly type = DELETE_ANNOTATION_SUCCESS;
  constructor(public payload: string) { }
}

export class DeleteAnnotationFail implements Action {
  readonly type = DELETE_ANNOTATION_FAIL;
  constructor(public payload: Error) {}
}

export class SelectedAnnotation implements Action {
  readonly type = SELECT_ANNOTATION;
  constructor(public payload: SelectionAnnotation) {}
}

export class SearchComment implements Action {
  readonly type = SEARCH_COMMENT;
  constructor(public payload: string) {}
}

export class ApplyCommentSymmaryFilter implements Action {
  readonly type = APPLY_COMMENT_SUMMARY_FILTER;
  constructor(public payload) {}
}

export type AnnotationsActions =
  | LoadAnnotationSet
  | LoadAnnotationSetSucess
  | LoadAnnotationSetFail
  | SaveAnnotation
  | SaveAnnotationSuccess
  | SaveAnnotationFail
  | AddOrEditComment
  | DeleteAnnotation
  | DeleteAnnotationSuccess
  | DeleteAnnotationFail
  | SelectedAnnotation
  | SearchComment;
