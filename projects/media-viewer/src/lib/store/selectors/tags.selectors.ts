import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromTags from '../reducers/tags.reducer';

export const getTagsRootState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.tags
);

export const getTagEntities = createSelector(
  getTagsRootState,
  fromTags.getTagNameEnt
);

export const getTagFilters = createSelector(
  getTagsRootState,
  fromTags.getFilters
);

export const getTagFiltered = createSelector(
  getTagsRootState,
  fromTags.getFilteredComments
);

export const getFilteredPageEntities = createSelector(
  getTagsRootState,
  fromTags.getFilteredPageEnt
);

export const getAllTagsArr = createSelector(
  getTagEntities,
  (tagEnt) => Object.keys(tagEnt).map(key => {
    return {
      key,
      length: Object.keys(tagEnt[key]).length
    };
  })
);
