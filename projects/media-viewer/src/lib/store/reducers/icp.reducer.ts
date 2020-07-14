import * as fromIcpActions from '../actions/icp.action';
import {IcpParticipant, IcpSession, IcpState} from '../../icp/icp.interfaces';
import {ICP_NEW_PARTICIPANT_JOINED} from '../actions/icp.action';

export const initialIcpSessionState: IcpState = {
  session: null,
  presenter: null,
  client: null,
  participants: null
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

      const participants = [];
      for (const id in participantInfo.participants) {
        participants.push( {id: id, username: participantInfo.participants[id]} );
      }

      return {
        ...state,
        session,
        client: participantInfo.client,
        presenter: participantInfo.presenter,
        participants
      };
    }

    case fromIcpActions.ICP_NEW_PARTICIPANT_JOINED: {
      const participant: IcpParticipant = action.payload;
      const participants = [...state.participants];
      participants.push(participant);
      return {
        ...state,
        participants
      }
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
