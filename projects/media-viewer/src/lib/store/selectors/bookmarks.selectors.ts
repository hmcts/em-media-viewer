import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromBookmarks from '../reducers/bookmarks.reducer';

export const getBookmarkState = createSelector(
  fromFeature.getBookmarksState,
  (state: fromBookmarks.BookmarksState) =>  state
);

export const getAllBookmarks = createSelector(
  getBookmarkState,
  fromBookmarks.getBookmarks
);
