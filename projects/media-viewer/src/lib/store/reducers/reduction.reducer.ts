import * as fromReduction from '../actions/reduction.actions';
import * as fromAnnotations from '../actions/annotations.action';
import {StoreUtils} from '../store-utils';
import {SelectionAnnotation} from '../../annotations/models/event-select.model'; // todo rename


export interface ReductionState {
  reductionEntities: {[id: string]: any};
  reductionPageEntities: {[id: string]: any};
  selectedRedaction: SelectionAnnotation | {};
}

export const initialReductionState: ReductionState = {
  reductionEntities: {},
  reductionPageEntities: {},
  selectedRedaction: {}
};

export function reductionReducer (
  state = initialReductionState,
  action: fromReduction.ReductionActions | fromAnnotations.AnnotationsActions
): ReductionState {
  switch (action.type) {

    case fromReduction.LOAD_REDUCTION_SUCCESS: {
      const payload = action.payload;
      if (payload) {
        const reductionEntities = StoreUtils.generateRedactionEntities(payload);
        const reductionPageEntities = StoreUtils.groupByKeyEntities(payload, 'page');
        return {
          ...state,
          reductionEntities,
          reductionPageEntities
        };
      }
      return {
        ...state
      }
    }

    case fromReduction.SAVE_REDUCTION_SUCCESS: {
      const {payload} =  action;
      const reductionEntities = {
        ...state.reductionEntities,
        [payload.redactionId]: payload
      };
      const reductionArray = Object.keys(reductionEntities).map(key => reductionEntities[key]);
      const reductionPageEntities = StoreUtils.groupByKeyEntities(reductionArray, 'page');
      return {
        ...state,
        reductionEntities,
        reductionPageEntities
      };
    }

    case fromReduction.SELECT_REDACTION:
    case fromAnnotations.SELECT_ANNOTATION: {
      return {
        ...state,
        selectedRedaction: action.payload
      };
    }

    case fromReduction.DELETE_REDUCTION_SUCCESS: {
      const page = action.payload.page;
      const id = action.payload.redactionId;
      const reductionEntities = {
        ...state.reductionEntities
      };
      delete reductionEntities[id];
      const pageRedactionRemoved = [
        ...state.reductionPageEntities[page].filter(redaction => redaction.redactionId !== id)
      ];
      const reductionPageEntities = {
        ...state.reductionPageEntities,
        [page]: pageRedactionRemoved
      };

      return {
        ...state,
        reductionPageEntities,
        reductionEntities,
      };
    }

    case fromReduction.UNMARK_ALL_SUCCESS: {
      return {
        ...state,
        ...initialReductionState
      };
    }
  }

  return state;
}


export const getReductionEnt = (state: ReductionState) => state.reductionEntities;
export const getPageEnt = (state: ReductionState) => state.reductionPageEntities;
export const getSelectedRedaction = (state: ReductionState) => state.selectedRedaction;



