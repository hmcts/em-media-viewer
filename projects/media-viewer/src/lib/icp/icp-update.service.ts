import { Injectable } from '@angular/core';
import { IcpParticipant, IcpScreenUpdate, IcpSession } from '../store/reducers/icp.reducer';
import { SocketService } from './socket.service';

@Injectable()
export class IcpUpdateService {

  SESSION_JOINED = '[Icp] Client Joined Session';
  CLIENT_DISCONNECTED = '[Icp] Client Disconnected From Session';
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

  clientDisconnected() {
    return this.socket.listen(this.CLIENT_DISCONNECTED);
  }

  updatePresenter(presenter: IcpParticipant) {
    this.socket.emit(this.UPDATE_PRESENTER, {...this.session, presenterId: presenter.id, presenterName: presenter.username});
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
