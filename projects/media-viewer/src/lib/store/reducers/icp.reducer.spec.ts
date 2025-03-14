import * as fromIcp from './icp.reducer';
import { initialIcpSessionState } from './icp.reducer';
import {
  IcpParticipantListUpdated,
  IcpPresenterUpdated,
  IcpSocketSessionJoined,
  LeaveIcpSocketSession,
  LoadIcpSession,
  SetCaseId
} from '../actions/icp.actions';

const icpState = {
  session: {
    sessionId: 'sessionId',
    documentId: 'documentId',
    caseId: 'caseId',
    dateOfHearing: new Date(),
    connectionUrl: 'url-connectionstring'
  },
  client: { id: 'clientId', username: 'name' },
  presenter: { id: 'presenterId', username: 'name' },
  participants: [{ id: 'participantId', username: 'name' }]
};

describe('IcpReducer', () => {

  it('should start loading icp state', function () {
    const state = fromIcp.icpReducer(initialIcpSessionState, new LoadIcpSession({ caseId: 'caseId', documentId: 'documentId' }));
    expect(state.session).toEqual(null);
    expect(state.client).toEqual(null);
    expect(state.presenter).toEqual(null);
    expect(state.participants).toEqual([]);
  });

  it('should set case id', function () {
    const state = fromIcp.icpReducer(initialIcpSessionState, new SetCaseId(icpState.session.caseId));
    expect(state.session.caseId).toEqual(icpState.session.caseId);
  });

  it('should join session', function () {
    const session = icpState.session;
    const participantInfo = {
      client: icpState.client,
      presenter: icpState.presenter
    };
    const state = fromIcp.icpReducer(initialIcpSessionState, new IcpSocketSessionJoined({ session, participantInfo }));
    expect(state.client).toEqual(participantInfo.client);
    expect(state.presenter).toEqual(participantInfo.presenter);
    expect(state.session).toEqual(session);
  });

  it('should update presenter', function () {
    const updatedPresenter = { id: 'newPresenterId', username: 'newPresenterName' };
    const state = fromIcp.icpReducer(icpState, new IcpPresenterUpdated(updatedPresenter));
    expect(state.presenter).toEqual(updatedPresenter);
  });

  it('leave icp session', function () {
    const state = fromIcp.icpReducer(icpState, new LeaveIcpSocketSession());
    expect(state.presenter).toEqual(null);
    expect(state.client).toEqual(null);
    expect(state.session).toEqual(null);
  });

  it('should update participants list', function () {
    const updatedParticipantsList = { 'participantId': 'name' };
    const state = fromIcp.icpReducer(initialIcpSessionState, new IcpParticipantListUpdated(updatedParticipantsList));
    expect(state.participants).toEqual(icpState.participants);
  });
});
