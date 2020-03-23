import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import {AnnotationSetState} from './annotatons.reducer';

export interface State {
  annotationsReducer: fromAnnotation.AnnotationSetState;
}

export const reducers: ActionReducerMap<State> = {
  annotationsReducer: fromAnnotation.reducer
};

export const getAnnoSetState = createFeatureSelector<AnnotationSetState>('annotationsReducer');

export * from './annotatons.reducer';
