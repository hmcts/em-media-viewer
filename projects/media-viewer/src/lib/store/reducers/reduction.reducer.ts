import * as fromReduction from '../actions/reduction.actions';
import {StoreUtils} from '../store-utils';


export interface ReductionState {
  reductionEntities: {[id: string]: any};
  reductionPageEntities: {[id: string]: any};
}

export const initialReductionState: ReductionState = {
  reductionEntities: {},
  reductionPageEntities: {},

};

export function reductionReducer (
  state = initialReductionState,
  action: fromReduction.ReductionActions
): ReductionState {
  switch (action.type) {
    case fromReduction.ADD_REDUCTION: {
      const {payload} =  action;
      const reductionEntities = {
        ...state.reductionEntities,
        [payload.id]: payload
      };
      const reductionArray = Object.keys(reductionEntities).map(key => reductionEntities[key]);
      const reductionPageEntities = StoreUtils.groupByKeyEntities(reductionArray, 'page');
      return {
        ...state,
        reductionEntities,
        reductionPageEntities
      };
    }

  }

  return state;
}

export const getPageEnt = (state: ReductionState) => state.reductionPageEntities;



