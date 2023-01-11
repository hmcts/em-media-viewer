export enum IcpEvents {
  SESSION_JOINED = 'IcpClientJoinedSession',
  CLIENT_DISCONNECTED = 'IcpClientDisconnectedFromSession',
  NEW_PARTICIPANT_JOINED = 'IcpNewParticipantJoinedSession',
  REMOVE_PARTICIPANT = 'IcpRemoveParticipantFromList',
  PARTICIPANTS_UPDATED = 'IcpParticipantsListUpdated',
  UPDATE_PRESENTER = 'IcpNewPresenterStartsPresenting',
  PRESENTER_UPDATED = 'IcpPresenterUpdated',
  UPDATE_SCREEN = 'IcpUpdateScreen',
  SCREEN_UPDATED = 'IcpScreenUpdated',
  SESSION_JOIN = 'IcpClientJoinSession',
  SESSION_LEAVE = 'IcpClientLeaveSession',
}
