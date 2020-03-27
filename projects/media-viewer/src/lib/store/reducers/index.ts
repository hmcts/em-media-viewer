import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromTags from './tags.reducer';
import {AnnotationSetState} from './annotatons.reducer';
import {TagsState} from './tags.reducer';

export interface State {
  annotations: fromAnnotation.AnnotationSetState;
  tag: fromTags.TagsState;
}

export const reducers: ActionReducerMap<State> = {
  annotations: fromAnnotation.reducer,
  tags: fromTags.tagsReducer
};

export const getMVState = createFeatureSelector<State>('media-viewer');
export const getTagState = createFeatureSelector<TagsState>('tagsReducer');

export * from './annotatons.reducer';
export * from './tags.reducer';
