import { Action } from '@ngrx/store';
import { Redaction } from '../../redaction/services/redaction.model';
import { Annotation } from '../../annotations/annotation-set/annotation-view/annotation.model';

export const LOAD_REDACTIONS = '[Redaction] Load Redaction';
export const LOAD_REDACTION_SUCCESS = '[Redaction] Load Redaction Success';
export const LOAD_REDACTION_FAIL = '[Redaction] Load Redaction Fail';

export const SAVE_REDACTION = '[Redaction] Save Redaction';
export const SAVE_REDACTION_SUCCESS = '[Redaction] Save Redaction Success';
export const SAVE_REDACTION_FAIL = '[Redaction] Save Redaction Fail';

export const DELETE_REDACTION = '[Redaction] Delete Redaction';
export const DELETE_REDACTION_SUCCESS = '[Redaction] Delete Redaction Success';
export const DELETE_REDACTION_FAIL = '[Redaction] Delete Redaction Fail';

export const SELECT_REDACTION = '[Redaction] Select Redaction';

export const REDACT = '[Redaction] Redact';
export const REDACT_SUCCESS = '[Redaction] Redact Success';
export const REDACT_FAIL = '[Redaction] Redact Fail';
export const CLEAR_REDACT_DOC_URL = '[Redaction] Clear Redacted Document Url';

export const UNMARK_ALL = '[Redaction] Unmark All';
export const UNMARK_ALL_SUCCESS = '[Redaction] Unmark All Success';


export class LoadRedactions implements Action {
  readonly type = LOAD_REDACTIONS;
  constructor(public payload: any) {}
}

export class LoadRedactionSuccess implements Action {
  readonly type = LOAD_REDACTION_SUCCESS;
  constructor(public payload: Redaction[]) {}
}

export class LoadRedactionFailure implements Action {
  readonly type = LOAD_REDACTION_FAIL;
  constructor(public payload: any) {}
}

export class SaveRedaction implements Action {
  readonly type = SAVE_REDACTION;
  constructor(public payload: Redaction) {}
}

export class SaveRedactionSuccess implements Action {
  readonly type = SAVE_REDACTION_SUCCESS;
  constructor(public payload: Redaction) {}
}

export class SaveRedactionFailure implements Action {
  readonly type = SAVE_REDACTION_FAIL;
  constructor(public payload: any) {}
}

export class DeleteRedaction implements Action {
  readonly type = DELETE_REDACTION;
  constructor(public payload: Annotation) {}
}

export class DeleteRedactionSuccess implements Action {
  readonly type = DELETE_REDACTION_SUCCESS;
  constructor(public payload: any) {}
}

export class DeleteRedactionFailure implements Action {
  readonly type = DELETE_REDACTION_FAIL;
  constructor(public payload: any) {}
}

export class SelectRedaction implements Action {
  readonly type = SELECT_REDACTION;
  constructor(public payload: any) {}
}

export class Redact implements Action {
  readonly type = REDACT;
  constructor(public payload: { redactions: any[], documentId: string }) {}
}

export class RedactSuccess implements Action {
  readonly type = REDACT_SUCCESS;
  constructor(public payload: { blob: Blob, filename: string }) {}
}

export class RedactFailure implements Action {
  readonly type = REDACT_FAIL;
  constructor(public payload: any) {}
}

export class ResetRedactedDocument implements Action {
  readonly type = CLEAR_REDACT_DOC_URL;
}


export class UnmarkAll implements Action {
  readonly type = UNMARK_ALL;
  constructor(public payload: string) {}
}

export class UnmarkAllSuccess implements Action {
  readonly type = UNMARK_ALL_SUCCESS;
}

export type RedactionActions =
  | LoadRedactions | LoadRedactionSuccess | LoadRedactionFailure
  | SaveRedaction | SaveRedactionSuccess | SaveRedactionFailure
  | DeleteRedaction | DeleteRedactionSuccess | DeleteRedactionFailure
  | SelectRedaction
  | Redact | RedactSuccess | RedactFailure | ResetRedactedDocument
  | UnmarkAll | UnmarkAllSuccess;
