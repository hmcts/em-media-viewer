import * as fromIcpActions from '../actions/icp.action';
import { IcpSession, IcpState } from '../../icp/icp.interfaces';

export const initialIcpSessionState: IcpState = {
  session: null,
  presenter: null,
  client: null
};

export function icpReducer (state = initialIcpSessionState,
                                  action: fromIcpActions.IcpActions): IcpState {

  switch (action.type) {

    case fromIcpActions.ICP_SOCKET_SESSION_JOINED: {
      const session: IcpSession = {...action.payload.session};
      const participantInfo = {...action.payload.participantInfo};
      return {
        ...state,
        session,
        client: participantInfo.client,
        presenter: participantInfo.presenter
      };
    }

    case fromIcpActions.ICP_PRESENTER_UPDATED: {
      const presenter = {...action.payload};
      return {
        ...state, presenter
      };
    }

    case fromIcpActions.LEAVE_ICP_SOCKET_SESSION: {
      return {
        ...state,
        session: null,
        presenter: null,
        client: null
      };
    }
  }
  return state;
}

export const getIcpSession = (state: IcpState) => state.session;
export const getPresenter = (state: IcpState) => state.presenter;
export const getClient = (state: IcpState) => state.client;
