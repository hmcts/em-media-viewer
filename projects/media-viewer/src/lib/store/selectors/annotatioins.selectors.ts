import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAnnotations from '../reducers/annotatons.reducer'

export const getAnnotationsSetState = createSelector(
  fromFeature.getAnnoSetState,
  (state: fromAnnotations.AnnotationSetState) =>  state
);

export const getAnnotationSet = createSelector(
  getAnnotationsSetState,
  fromAnnotations.getAnnoSet
);
