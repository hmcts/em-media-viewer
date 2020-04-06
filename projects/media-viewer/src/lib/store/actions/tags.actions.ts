import { Action } from '@ngrx/store';
import {TagsModel} from '../../annotations/models/tags.model';
export const UPDATE_TAGS = '[Tags] Update Tags';
export const ADD_FILTER_TAGS = '[Tags] Add Filter Tags';

export class UpdateTags implements Action {
  readonly type = UPDATE_TAGS;
  constructor(public payload: {tags: TagsModel[]; annoId: string}) {}
}

export class AddFilterTags implements Action {
  readonly type = ADD_FILTER_TAGS;
  constructor(public payload: {[id: string]: boolean}) {}
}


export type TagsActions =
  | UpdateTags
  | AddFilterTags;
