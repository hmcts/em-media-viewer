import * as fromIcpActions from '../actions/icp.action';
import { PdfPosition } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

export interface IcpState {
  session: IcpSession;
  screen: IcpScreenUpdate;
  presenter: IcpParticipant;
  client: IcpParticipant;
}

export interface IcpSession {
  sessionId: string;
  caseId: string;
  dateOfHearing: Date;
}

export interface IcpParticipant {
  id: string;
  username: string;
}

export interface IcpScreenUpdate {
  pdfPosition: PdfPosition;
  document: string;
}

export const initialIcpSessionState: IcpState = {
  session: null,
  screen: null,
  presenter: null,
  client: null
};

export function icpReducer (state = initialIcpSessionState,
                                  action: fromIcpActions.IcpActions): IcpState {

  switch (action.type) {

    case fromIcpActions.ICP_SOCKET_SESSION_JOINED: {
      const session: IcpSession = action.payload.session;
      const participantInfo = action.payload.participantInfo;
      return {
        ...state,
        session,
        client: participantInfo.client,
        presenter: participantInfo.presenter
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
        session: null,
        screen: null,
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
