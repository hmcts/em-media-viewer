import { Action } from '@ngrx/store';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { PdfPosition } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

export const SET_DOCUMENT_ID = '[Document] Set Document Id';
export const POSITION_UPDATED = '[Document] Position Updated';
export const ADD_PAGES = '[Document] Add Pages';
export const CONVERT = '[Document] Convert';
export const CONVERT_SUCCESS = '[Document] Convert Success';
export const CONVERT_FAIL = '[Document] Convert Fail';
export const CLEAR_CONVERT_DOC_URL = '[Document] Clear Convert Doc Url';


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

export type DocumentActions = AddPages | SetDocumentId |
  Convert | ConvertSuccess | ConvertFail |
  ClearConvertDocUrl | PdfPositionUpdate;
