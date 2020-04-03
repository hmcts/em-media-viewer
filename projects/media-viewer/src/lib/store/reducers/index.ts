import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';

export interface State {
  annotations: fromAnnotation.AnnotationSetState;
}

export const reducers: ActionReducerMap<State> = {
  annotations: fromAnnotation.reducer,
};

export const getMVState = createFeatureSelector<State>('media-viewer');

export * from './annotatons.reducer';
