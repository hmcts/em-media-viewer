import { Action } from '@ngrx/store';
import { IcpParticipant, IcpSession } from '../../icp/icp.interfaces';

export const SET_CASE_ID = '[Icp] Set Case Id';
export const LOAD_ICP_SESSION = '[Icp] Load Session';
export const LOAD_ICP_SESSION_FAIL = '[Icp] Load Session Failure';
export const JOIN_ICP_SOCKET_SESSION = '[Icp] Join Socket Session';
export const ICP_SOCKET_SESSION_JOINED = '[Icp] Socket Session Joined';
export const LEAVE_ICP_SOCKET_SESSION = '[Icp] Leave Socket Session';
export const ICP_PRESENTER_UPDATED = '[Icp] Presenter Updated';
export const ICP_NEW_PARTICIPANT_JOINED = '[Icp] New Participant Joined Session';

export class SetCaseId implements Action {
  readonly type = SET_CASE_ID;
  constructor(public payload: string) {}
}

export class LoadIcpSession implements Action {
  readonly type = LOAD_ICP_SESSION;
  constructor(public payload: string) {}
}

export class LoadIcpSessionFailure implements Action {
  readonly type = LOAD_ICP_SESSION_FAIL;
  constructor(public payload: Error) {}
}

export class JoinIcpSocketSession implements Action {
  readonly type = JOIN_ICP_SOCKET_SESSION;
  constructor(public payload: { username: string, session: IcpSession }) {}
}

export class IcpSocketSessionJoined implements Action {
  readonly type = ICP_SOCKET_SESSION_JOINED;
  constructor(public payload: { session: IcpSession, participantInfo: { client: IcpParticipant, presenter: IcpParticipant, participants: any } }) {}
}

export class LeaveIcpSocketSession implements Action {
  readonly type = LEAVE_ICP_SOCKET_SESSION;
  constructor() {}
}

export class IcpPresenterUpdated implements Action {
  readonly type = ICP_PRESENTER_UPDATED;
  constructor(public payload: IcpParticipant) {}
}

export class IcpNewParticipantJoined implements Action {
  readonly type = ICP_NEW_PARTICIPANT_JOINED;
  constructor(public payload: IcpParticipant) {}
}

export type IcpActions =
  | SetCaseId
  | LoadIcpSession
  | LoadIcpSessionFailure
  | JoinIcpSocketSession
  | IcpSocketSessionJoined
  | LeaveIcpSocketSession
  | IcpPresenterUpdated
  | IcpNewParticipantJoined;
