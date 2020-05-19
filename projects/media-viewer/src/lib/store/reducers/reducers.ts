import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromDocument from './document.reducer';
import * as fromAnnotation from './annotatons.reducer';
import * as fromTags from './tags.reducer';
import * as fromBookmarks from './bookmarks.reducer';
import { BookmarksState } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import * as fromRedaction from './redaction.reducer';
import * as fromIcp from './icp.reducer';

export interface State {
  document: fromDocument.DocumentState;
  annotations: fromAnnotation.AnnotationSetState;
  tags: fromTags.TagsState;
  bookmarks: BookmarksState;
  redactions: fromRedaction.RedactionState;
  icp: fromIcp.IcpState;
}

export const reducers: ActionReducerMap<State> = {
  document: fromDocument.docReducer,
  annotations: fromAnnotation.reducer,
  tags: fromTags.tagsReducer,
  bookmarks: fromBookmarks.bookmarksReducer,
  redactions: fromRedaction.redactionReducer,
  icp: fromIcp.icpReducer,
};

export const getMVState = createFeatureSelector<State>('media-viewer');

export * from './document.reducer';
export * from './annotatons.reducer';
export * from './tags.reducer';
export * from './bookmarks.reducer';
export * from './redaction.reducer';
export * from './icp.reducer';
