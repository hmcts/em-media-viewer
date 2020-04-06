import * as fromAnnotations from '../actions/annotations.action';
import * as fromTags from '../actions/tags.actions';
import {StoreUtils} from '../store-utils';

export interface TagsState {
  tagNameEnt: {[id: string]: string[]};
  filters: string[]
}

export const initialTagState: TagsState = {
  tagNameEnt: {},
  filters: []
};

export function tagsReducer (
  state = initialTagState,
  action: fromAnnotations.AnnotationsActions | fromTags.TagsActions
): TagsState {
  switch (action.type) {
    case fromAnnotations.LOAD_ANNOTATION_SET_SUCCESS: {
      const annotations = action.payload.annotations;
      const tagNameEnt = StoreUtils.genTagNameEntities(annotations);
      return {
        ...state,
        tagNameEnt
      };
    }

    case fromTags.ADD_FILTER_TAGS: {
      const payload = action.payload;
      const filters = Object.keys(payload).reduce((arr: string[], key: string) => {
        return payload[key] ? [...arr, key] : arr;
      }, []);

      return {
        ...state,
        filters
      };
    }

  }
  return state;
}

export const getTagNameEnt = (state: TagsState) => state.tagNameEnt;
export const getFilters = (state: TagsState) => state.filters;


