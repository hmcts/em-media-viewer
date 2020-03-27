import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromTags from '../reducers/tags.reducer';

export const getTagsRootState = createSelector(
  fromFeature.getTagState,
  (state: fromTags.TagsState) =>  state
);

export const getTagEntities = createSelector(
  getTagsRootState,
  fromTags.getTagNameEnt
);

export const getAllTagsArr = createSelector(
  getTagEntities,
  (tagEnt) => Object.keys(tagEnt).map(key => key)
);
