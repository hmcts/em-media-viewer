import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromBookmarks from './bookmarks.reducer';

export interface State {
  annotations: fromAnnotation.AnnotationSetState;
  bookmarksReducer: fromBookmarks.BookmarksState;
}

export const reducers: ActionReducerMap<State> = {
  annotations: fromAnnotation.reducer,
  bookmarksReducer: fromBookmarks.bookmarksReducer
};

export const getMVState = createFeatureSelector<State>('media-viewer');

export * from './annotatons.reducer';
