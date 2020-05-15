import { Action } from '@ngrx/store';


export const SET_DOCUMENT_ID = '[Document] Set Document Id';
export const ADD_PAGE = '[Document] Add Page';

export class SetDocumentId implements Action {
  readonly type = SET_DOCUMENT_ID;
  constructor(public payload: string) { }
}

export class AddPage implements Action {
  readonly type = ADD_PAGE;
  constructor(public payload: { div: any; pageNumber: number; scale: string; rotation: string }) { }
}

export type DocumentActions = AddPage | SetDocumentId;
