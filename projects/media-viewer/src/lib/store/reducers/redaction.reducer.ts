import * as fromRedaction from '../actions/redaction.actions';
import * as fromAnnotations from '../actions/annotations.action';
import {StoreUtils} from '../store-utils';
import {SelectionAnnotation} from '../../annotations/models/event-select.model'; // todo rename


export interface RedactionState {
  redactionEntities: {[id: string]: any};
  redactionPageEntities: {[id: string]: any};
  selectedRedaction: SelectionAnnotation | {};
}

export const initialRedactionState: RedactionState = {
  redactionEntities: {},
  redactionPageEntities: {},
  selectedRedaction: {}
};

export function redactionReducer (
  state = initialRedactionState,
  action: fromRedaction.RedactionActions | fromAnnotations.AnnotationsActions
): RedactionState {
  switch (action.type) {

    case fromRedaction.LOAD_REDUCTIONS: {
      return {
        ...state,
        ...initialRedactionState
      };
    }

    case fromRedaction.LOAD_REDUCTION_SUCCESS: {
      const payload = action.payload;
      if (payload) {
        const redactionEntities = StoreUtils.generateRedactionEntities(payload);
        const redactionPageEntities = StoreUtils.groupByKeyEntities(payload, 'page');
        return {
          ...state,
          redactionEntities,
          redactionPageEntities
        };
      }
      return {
        ...state
      };
    }

    case fromRedaction.SAVE_REDUCTION_SUCCESS: {
      const {payload} =  action;
      const redactionEntities = {
        ...state.redactionEntities,
        [payload.redactionId]: payload
      };
      const redactionArray = Object.keys(redactionEntities).map(key => redactionEntities[key]);
      const redactionPageEntities = StoreUtils.groupByKeyEntities(redactionArray, 'page');
      return {
        ...state,
        redactionEntities,
        redactionPageEntities
      };
    }

    case fromRedaction.SELECT_REDACTION:
    case fromAnnotations.SELECT_ANNOTATION: {
      return {
        ...state,
        selectedRedaction: action.payload
      };
    }

    case fromRedaction.DELETE_REDUCTION_SUCCESS: {
      const page = action.payload.page;
      const id = action.payload.redactionId;
      const redactionEntities = {
        ...state.redactionEntities
      };
      delete redactionEntities[id];
      const pageRedactionRemoved = [
        ...state.redactionPageEntities[page].filter(redaction => redaction.redactionId !== id)
      ];
      const redactionPageEntities = {
        ...state.redactionPageEntities,
        [page]: pageRedactionRemoved
      };

      return {
        ...state,
        redactionPageEntities,
        redactionEntities,
      };
    }

    case fromRedaction.UNMARK_ALL_SUCCESS: {
      return {
        ...state,
        ...initialRedactionState
      };
    }
  }

  return state;
}


export const getRedactionEnt = (state: RedactionState) => state.redactionEntities;
export const getPageEnt = (state: RedactionState) => state.redactionPageEntities;
export const getSelectedRedaction = (state: RedactionState) => state.selectedRedaction;



