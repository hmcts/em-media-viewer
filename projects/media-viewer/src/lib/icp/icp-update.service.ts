import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { IcpParticipant, IcpScreenUpdate, IcpSession } from './icp.interfaces';
import { from, of } from 'rxjs';
import { IcpEvents } from './icp.events';

@Injectable()
export class IcpUpdateService {

  session: IcpSession;

  constructor(private socket: SocketService) { }

  joinSession(username: string, session: IcpSession) {
    this.session = session;
    this.socket.connect(session.connectionUrl)
    this.socket.connected().subscribe(isConnected => {
      if (isConnected) {
        this.socket.join({ ...this.session, username });
      }
    });
    return this.socket.listen(IcpEvents.SESSION_JOINED);
  }

  leaveSession() {
    this.socket.leave(this.session);
  }

  newParticipantJoined() {
    return this.socket.listen(IcpEvents.NEW_PARTICIPANT_JOINED);
  }

  clientDisconnected() {
    return this.socket.listen(IcpEvents.CLIENT_DISCONNECTED);
  }

  removeParticipant(participantId) {
    this.socket.emit(IcpEvents.REMOVE_PARTICIPANT, {
      participantId: participantId, caseId: this.session.caseId
    });
  }

  participantListUpdated() {
    return this.socket.listen(IcpEvents.PARTICIPANTS_UPDATED);
  }

  updatePresenter(presenter: IcpParticipant) {
    this.socket.emit(IcpEvents.UPDATE_PRESENTER, {
      ...this.session, presenterId: presenter.id, presenterName: presenter.username
    });
  }

  presenterUpdated() {
    return this.socket.listen(IcpEvents.PRESENTER_UPDATED);
  }

  updateScreen(screen: IcpScreenUpdate) {
    const update = { body: screen, caseId: this.session.caseId };
    this.socket.emit(IcpEvents.UPDATE_SCREEN, update);
  }

  screenUpdated() {
    return this.socket.listen(IcpEvents.SCREEN_UPDATED);
  }
}
