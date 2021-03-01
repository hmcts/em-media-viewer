import * as fromIcpActions from '../actions/icp.actions';
import { IcpSession, IcpState } from '../../icp/icp.interfaces';

export const initialIcpSessionState: IcpState = {
  session: null,
  presenter: null,
  client: null,
  participants: []
};

export function icpReducer (state = initialIcpSessionState,
                                  action: fromIcpActions.IcpActions): IcpState {

  switch (action.type) {

    case fromIcpActions.SET_CASE_ID: {
      const caseId = action.payload;
      const session = {...state.session, caseId};
      return {
        ...state,
        session
      };
    }

    case fromIcpActions.ICP_SOCKET_SESSION_JOINED: {
      const session: IcpSession = action.payload.session;
      const participantInfo = action.payload.participantInfo;
      return {
        ...state,
        session,
        client: participantInfo.client,
        presenter: participantInfo.presenter,
      };
    }

    case fromIcpActions.ICP_PARTICIPANT_LIST_UPDATED: {
      const updatedParticipants: any = action.payload;
      const participants = Object.keys(updatedParticipants)
        .map(id => ({ id: id, username: updatedParticipants[id] }));
      return {
        ...state,
        participants
      };
    }

    case fromIcpActions.ICP_PRESENTER_UPDATED: {
      const presenter = action.payload;
      return {
        ...state, presenter
      };
    }

    case fromIcpActions.LEAVE_ICP_SOCKET_SESSION: {
      return {
        ...state,
        ...initialIcpSessionState
      };
    }
  }
  return state;
}

export const getIcpSession = (state: IcpState) => state.session;
export const getPresenter = (state: IcpState) => state.presenter;
export const getClient = (state: IcpState) => state.client;
export const getParticipants = (state: IcpState) => state.participants;
