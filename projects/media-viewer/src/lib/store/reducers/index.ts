import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromTags from './tags.reducer';
import * as fromBookmarks from './bookmarks.reducer';
import { BookmarksState } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

export interface State {
  annotations: fromAnnotation.AnnotationSetState;
  tags: fromTags.TagsState;
  bookmarks: BookmarksState;
}

export const reducers: ActionReducerMap<State> = {
  annotations: fromAnnotation.reducer,
  tags: fromTags.tagsReducer,
  bookmarks: fromBookmarks.bookmarksReducer
};

export const getMVState = createFeatureSelector<State>('media-viewer');

export * from './annotatons.reducer';
export * from './tags.reducer';
export * from './bookmarks.reducer';
