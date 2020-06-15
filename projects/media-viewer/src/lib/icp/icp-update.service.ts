import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { IcpParticipant, IcpScreenUpdate, IcpSession } from './icp.interfaces';

@Injectable()
export class IcpUpdateService {

  SESSION_JOINED = '[Icp] Client Joined Session';
  CLIENT_DISCONNECTED = '[Icp] Client Disconnected From Session';
  NEW_PARTICIPANT_JOINED = '[Icp] New Participant Joined Session';
  UPDATE_PRESENTER = '[Icp] New Presenter Starts Presenting';
  PRESENTER_UPDATED =  '[Icp] Presenter Updated';
  UPDATE_SCREEN = '[Icp] Update Screen';
  SCREEN_UPDATED = '[Icp] Screen Updated';

  session: IcpSession;

  constructor(private socket: SocketService) {}

  joinSession(username: string, session: IcpSession) {
    this.session = session;
    this.socket.connect();
    this.socket.join({...this.session, username});
    return this.socket.listen(this.SESSION_JOINED);
  }

  leaveSession() {
    this.socket.leave(this.session);
  }

  newParticipantJoined() {
    return this.socket.listen(this.NEW_PARTICIPANT_JOINED);
  }

  clientDisconnected() {
    return this.socket.listen(this.CLIENT_DISCONNECTED);
  }

  updatePresenter(presenter: IcpParticipant) {
    this.socket.emit(this.UPDATE_PRESENTER, {
      ...this.session, presenterId: presenter.id, presenterName: presenter.username
    });
  }

  presenterUpdated() {
    return this.socket.listen(this.PRESENTER_UPDATED);
  }

  updateScreen(screen: IcpScreenUpdate) {
    const update = { body: screen, sessionId: this.session.sessionId };
    this.socket.emit(this.UPDATE_SCREEN, update);
  }

  screenUpdated() {
    return this.socket.listen(this.SCREEN_UPDATED);
  }
}
