import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromBookmarks from '../reducers/bookmarks.reducer';

export const getBookmarkState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.bookmarks
);

export const getAllBookmarks = createSelector(
  getBookmarkState,
  fromBookmarks.getBookmarks
);
