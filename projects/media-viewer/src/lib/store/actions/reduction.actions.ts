import { Action } from '@ngrx/store';
export const ADD_REDUCTION = '[Reduction] Add Reduction';

export class AddReduction implements Action {
  readonly type = ADD_REDUCTION;
  constructor(public payload: any) {}
}

export type ReductionActions =
  | AddReduction;
