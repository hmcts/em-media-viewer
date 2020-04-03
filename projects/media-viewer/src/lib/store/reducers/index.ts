import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromTags from './tags.reducer';

export interface State {
  annotations: fromAnnotation.AnnotationSetState;
  tags: fromTags.TagsState;
}

export const reducers: ActionReducerMap<State> = {
  annotations: fromAnnotation.reducer,
  tags: fromTags.tagsReducer
};

export const getMVState = createFeatureSelector<State>('media-viewer');

export * from './annotatons.reducer';
export * from './tags.reducer';
