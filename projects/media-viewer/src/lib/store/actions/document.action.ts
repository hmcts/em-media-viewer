import { Action } from '@ngrx/store';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { PdfPosition } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';


export const SET_DOCUMENT_ID = '[Document] Set Document Id';
export const POSITION_UPDATED = '[Document] Position Updated';
export const ADD_PAGES = '[Document] Add Pages';

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

export type DocumentActions = AddPages | SetDocumentId | PdfPositionUpdate;
