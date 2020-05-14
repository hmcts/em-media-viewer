import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromTags from './tags.reducer';
import * as fromBookmarks from './bookmarks.reducer';
import * as fromReduction from './redaction.reducer';

export interface State {
  annotations: fromAnnotation.AnnotationSetState;
  tags: fromTags.TagsState;
  bookmarks: fromBookmarks.BookmarksState;
  reductions: fromReduction.ReductionState;
}

export const reducers: ActionReducerMap<State> = {
  annotations: fromAnnotation.reducer,
  tags: fromTags.tagsReducer,
  bookmarks: fromBookmarks.bookmarksReducer,
  reductions: fromReduction.redactionReducer
};

export const getMVState = createFeatureSelector<State>('media-viewer');

export * from './annotatons.reducer';
export * from './tags.reducer';
export * from './bookmarks.reducer';
export * from './redaction.reducer';
