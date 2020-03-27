import { Action } from '@ngrx/store';
import {TagsModel} from '../../annotations/models/tags.model';
export const UPDATE_TAGS = '[Tags] Update Tags';

export class UpdateTags implements Action {
  readonly type = UPDATE_TAGS;
  constructor(public payload: {tags: TagsModel[]; annoId: string}) {}
}

export type TagsActions =
  | UpdateTags;
