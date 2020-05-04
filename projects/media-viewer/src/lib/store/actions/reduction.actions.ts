import { Action } from '@ngrx/store';

export const LOAD_REDUCTIONS = '[Reduction] Load Reduction';
export const LOAD_REDUCTION_SUCCESS = '[Reduction] Load Reduction Success';
export const LOAD_REDUCTION_FAIL = '[Reduction] Load Reduction Fail';

export const SAVE_REDUCTION = '[Reduction] Save Reduction';
export const SAVE_REDUCTION_SUCCESS = '[Reduction] Save Reduction Success';
export const SAVE_REDUCTION_FAIL = '[Reduction] Save Reduction Fail';

export const DELETE_REDUCTION = '[Reduction] Delete Reduction';
export const DELETE_REDUCTION_SUCCESS = '[Reduction] Delete Reduction Success';
export const DELETE_REDUCTION_FAIL = '[Reduction] Delete Reduction Fail';


export class LoadReductions implements Action {
  readonly type = LOAD_REDUCTIONS;
  constructor(public payload: any) {}
}

export class LoadReductionSuccess implements Action {
  readonly type = LOAD_REDUCTION_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadReductionFail implements Action {
  readonly type = LOAD_REDUCTION_FAIL;
  constructor(public payload: any) {}
}

export class SaveReduction implements Action {
  readonly type = SAVE_REDUCTION;
  constructor(public payload: any) {}
}

export class SaveReductionSuccess implements Action {
  readonly type = SAVE_REDUCTION_SUCCESS;
  constructor(public payload: any) {}
}

export class SaveReductionFail implements Action {
  readonly type = SAVE_REDUCTION_FAIL;
  constructor(public payload: any) {}
}

export class DeleteReduction implements Action {
  readonly type = DELETE_REDUCTION;
  constructor(public payload: any) {}
}

export class DeleteReductionSuccess implements Action {
  readonly type = DELETE_REDUCTION_SUCCESS;
  constructor(public payload: any) {}
}

export class DeleteReductionFail implements Action {
  readonly type = DELETE_REDUCTION_FAIL;
  constructor(public payload: any) {}
}

export type ReductionActions =
  | LoadReductions
  | LoadReductionSuccess
  | LoadReductionFail
  | SaveReduction
  | SaveReductionSuccess
  | SaveReductionFail
  | DeleteReduction
  | DeleteReductionSuccess
  | DeleteReductionFail;
