import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromBookmarks from './bookmarks.reducer';
import { BookmarksState } from './bookmarks.reducer';

export interface State {
  annotations: fromAnnotation.AnnotationSetState;
  bookmarks: BookmarksState;
}

export const reducers: ActionReducerMap<State> = {
  annotations: fromAnnotation.reducer,
  bookmarks: fromBookmarks.bookmarksReducer
};

export const getMVState = createFeatureSelector<State>('media-viewer');

export * from './annotatons.reducer';
export * from './bookmarks.reducer';
