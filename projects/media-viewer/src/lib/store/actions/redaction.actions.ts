import { Action } from '@ngrx/store';

export const LOAD_REDUCTIONS = '[Redaction] Load Redaction';
export const LOAD_REDUCTION_SUCCESS = '[Redaction] Load Redaction Success';
export const LOAD_REDUCTION_FAIL = '[Redaction] Load Redaction Fail';

export const SAVE_REDUCTION = '[Redaction] Save Redaction';
export const SAVE_REDUCTION_SUCCESS = '[Redaction] Save Redaction Success';
export const SAVE_REDUCTION_FAIL = '[Redaction] Save Redaction Fail';

export const DELETE_REDUCTION = '[Redaction] Delete Redaction';
export const DELETE_REDUCTION_SUCCESS = '[Redaction] Delete Redaction Success';
export const DELETE_REDUCTION_FAIL = '[Redaction] Delete Redaction Fail';

export const SELECT_REDACTION = '[Redaction] Select Redaction';

export const REDACT = '[Redaction] Redact';
export const REDACT_FAIL = '[Redaction] Redact Fail';

export const UNMARK_ALL = '[Redaction] Unmark All';
export const UNMARK_ALL_SUCCESS = '[Redaction] Unmark All Success';


export class LoadRedactions implements Action {
  readonly type = LOAD_REDUCTIONS;
  constructor(public payload: any) {}
}

export class LoadRedactionSuccess implements Action {
  readonly type = LOAD_REDUCTION_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadRedactionFail implements Action {
  readonly type = LOAD_REDUCTION_FAIL;
  constructor(public payload: any) {}
}

export class SaveRedaction implements Action {
  readonly type = SAVE_REDUCTION;
  constructor(public payload: any) {}
}

export class SaveRedactionSuccess implements Action {
  readonly type = SAVE_REDUCTION_SUCCESS;
  constructor(public payload: any) {}
}

export class SaveRedactionFail implements Action {
  readonly type = SAVE_REDUCTION_FAIL;
  constructor(public payload: any) {}
}

export class DeleteRedaction implements Action {
  readonly type = DELETE_REDUCTION;
  constructor(public payload: any) {}
}

export class DeleteRedactionSuccess implements Action {
  readonly type = DELETE_REDUCTION_SUCCESS;
  constructor(public payload: any) {}
}

export class DeleteRedactionFail implements Action {
  readonly type = DELETE_REDUCTION_FAIL;
  constructor(public payload: any) {}
}

export class SelectRedaction implements Action {
  readonly type = SELECT_REDACTION;
  constructor(public payload: any) {}
}

export class Redact implements Action {
  readonly type = REDACT;
  constructor(public payload: any) {}
}

export class RedactFail implements Action {
  readonly type = REDACT_FAIL;
  constructor(public payload: any) {}
}


export class UnmarkAll implements Action {
  readonly type = UNMARK_ALL;
  constructor(public payload: string) {}
}

export class UnmarkAllSuccess implements Action {
  readonly type = UNMARK_ALL_SUCCESS;
}

export type RedactionActions =
  | LoadRedactions
  | LoadRedactionSuccess
  | LoadRedactionFail
  | SaveRedaction
  | SaveRedactionSuccess
  | SaveRedactionFail
  | DeleteRedaction
  | DeleteRedactionSuccess
  | DeleteRedactionFail
  | SelectRedaction
  | Redact
  | UnmarkAll
  | UnmarkAllSuccess;
