import { Action } from '@ngrx/store';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { PdfPosition } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import { Rotation } from '../../rotation/rotation.model';

export const SET_DOCUMENT_ID = '[Document] Set Document Id';
export const POSITION_UPDATED = '[Document] Position Updated';
export const ADD_PAGES = '[Document] Add Pages';
export const CONVERT = '[Document] Convert';
export const CONVERT_SUCCESS = '[Document] Convert Success';
export const CONVERT_FAIL = '[Document] Convert Fail';
export const CLEAR_CONVERT_DOC_URL = '[Document] Clear Convert Doc Url';

export const LOAD_ROTATION = '[Document Load Rotation]'
export const LOAD_ROTATION_SUCCESS = '[Document Load Rotation Success]'
export const LOAD_ROTATION_FAIL = '[Document Load Rotation Fail]'
export const SAVE_ROTATION = '[Document Save Rotation]'
export const SAVE_ROTATION_SUCCESS = '[Document Save Rotation Success]'
export const SAVE_ROTATION_FAIL = '[Document Save Rotation Fail]'

export class SetDocumentId implements Action {
  readonly type = SET_DOCUMENT_ID;
  constructor(public payload: string) { }
}

export class AddPages implements Action {
  readonly type = ADD_PAGES;
  constructor(public payload: PageEvent[]) { }
}

export class PdfPositionUpdate implements Action {
  readonly type = POSITION_UPDATED;
  constructor(public payload: PdfPosition) {}
}

export class Convert implements Action {
  readonly type = CONVERT;
  constructor(public payload: string ) {}
}

export class ConvertSuccess implements Action {
  readonly type = CONVERT_SUCCESS;
  constructor(public payload: string ) {}
}

export class ConvertFail implements Action {
  readonly type = CONVERT_FAIL;
  constructor(public payload: any) {}
}

export class ClearConvertDocUrl implements Action {
  readonly type = CLEAR_CONVERT_DOC_URL;
}

export class LoadRotation implements Action {
  readonly type = LOAD_ROTATION;
  constructor(public payload: string) {
  }
}

export class LoadRotationSuccess implements Action {
  readonly type = LOAD_ROTATION_SUCCESS;
  constructor(public payload: any) {
  }
}

export class LoadRotationFail implements Action {
  readonly type = LOAD_ROTATION_FAIL;
  constructor(public payload: Error) {
  }
}

export class SaveRotation implements Action {
  readonly type = SAVE_ROTATION;
  constructor(public payload: Rotation) {
  }
}

export class SaveRotationSuccess implements Action {
  readonly type = SAVE_ROTATION_SUCCESS;
  constructor(public payload: any) {
  }
}

export class SaveRotationFail implements Action {
  readonly type = SAVE_ROTATION_FAIL;
  constructor(public payload: Error) {
  }
}

export type DocumentActions =
  | AddPages | SetDocumentId | Convert
  | ConvertSuccess | ConvertFail | ClearConvertDocUrl
  | PdfPositionUpdate | LoadRotation | LoadRotationSuccess
  | LoadRotationFail | SaveRotation | SaveRotationSuccess
  | SaveRotationFail;
