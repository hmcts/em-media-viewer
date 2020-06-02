import { Action } from '@ngrx/store';


export const SET_DOCUMENT_ID = '[Document] Set Document Id';
export const ADD_PAGES = '[Document] Add Pages';

export class SetDocumentId implements Action {
  readonly type = SET_DOCUMENT_ID;
  constructor(public payload: string) { }
}

export class AddPages implements Action {
  readonly type = ADD_PAGES;
  constructor(public payload: {scale: number, id: string, div: object, rotation: number}[]) { }
}

export type DocumentActions = AddPages | SetDocumentId;
