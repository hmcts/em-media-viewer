import * as fromReduction from '../actions/reduction.actions';
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
  action: fromReduction.ReductionActions
): ReductionState {
  switch (action.type) {
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

    case fromReduction.SELECT_REDACTION: {
      return {
        ...state,
        selectedRedaction: action.payload
      }
    }

  }

  return state;
}

export const getPageEnt = (state: ReductionState) => state.reductionPageEntities;
export const getSelectedRedaction = (state: ReductionState) => state.selectedRedaction;



