import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers/reducers';
import * as fromIcp from '../reducers/icp.reducer';

export const getIcpState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.icp
);

export const getIcpSession = createSelector(
  getIcpState,
  fromIcp.getIcpSession
);

export const getCaseId = createSelector(
  getIcpSession,
  session => session === null ? null : session.caseId
);

export const getPresenter = createSelector(
  getIcpState,
  fromIcp.getPresenter
);

export const getPresenterName = createSelector(
  getPresenter,
  presenter => presenter === null ? null : presenter.username
);

export const getClient = createSelector(
  getIcpState,
  fromIcp.getClient
);

export const isPresenter = createSelector(
  getPresenter,
  getClient,
  (presenter, client) => presenter === null ? undefined : presenter.id === client.id // isPresenter is called when = false.
);

export const getParticipants = createSelector(
  getIcpState,
  fromIcp.getParticipants
);
