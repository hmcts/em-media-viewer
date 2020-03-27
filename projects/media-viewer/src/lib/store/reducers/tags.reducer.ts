import * as fromAnnotations from '../actions/annotations.action';
import * as fromTags from '../actions/tags.actions';
import {TagsModel} from '../../annotations/models/tags.model';
import {StoreUtils} from '../store-utils';

export interface TagsState {
  tagNameEnt: {[id: string]: string[]};
}

export const initialTagState: TagsState = {
  tagNameEnt: {},
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

    // case fromAnnotations.SAVE_ANNOTATION_SUCCESS: {
    //   const annotation = action.payload;
    //   const tagNameEnt = {
    //     ...state.tagNameEnt,
    //     ...StoreUtils.genTagNameEntities([annotation])
    //   };
    //   return {
    //     ...state,
    //     tagNameEnt
    //   }
    //
    // }

    // case fromAnnotations.DELETE_ANNOTATION_SUCCESS: {
    //   const annotation = action.payload;
    //   const tagNameEnt = {
    //     ...state.tagNameEnt,
    //   };
    //   delete tagNameEnt[annotation];
    //   return {
    //     ...state,
    //     tagNameEnt
    //   };
    // }
    //
    // case fromTags.UPDATE_TAGS: {
    //   const payload = action.payload;
    //   const tagNameEnt = {
    //     ...state.tagNameEnt,
    //     [payload.annoId]: payload.tags
    //   };
    //
    //   return {
    //     ...state,
    //     tagNameEnt
    //   };
    // }

  }
  return state;
}

export const getTagNameEnt = (state: TagsState) => state.tagNameEnt;


