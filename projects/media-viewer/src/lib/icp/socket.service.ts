import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, Observable, of, Subject, Subscription } from 'rxjs';
import socketio from 'socket.io-client/dist/socket.io.js';
import { switchMap } from 'rxjs/operators';
import { getViewComponent } from '@angular/core/src/render3/discovery_utils';
import { IcpEvents } from './icp.events';
import { IcpParticipant } from './icp.interfaces';

@Injectable()
export class SocketService implements OnDestroy {

  private socket: WebSocket;
  subscription: Subscription;
  private connected$ = new BehaviorSubject<boolean>(false);
  private sessionJoined$ = new Subject();
  private presenterUpdated$ = new Subject();
  private clientDisconnected$ = new Subject();
  private participantUpdated$ = new Subject();
  private newParticipantJoined$ = new Subject();
  private screenUpdated$ = new Subject();

  constructor() { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  connect(url: string) {
    return this.getSocketClient(url).subscribe((socket: WebSocket) => {

      socket.onopen = (event: Event) => {
        this.connected$.next(true);
      };

      socket.onmessage = (event: MessageEvent) => {
        console.log("onmessage");
        const eventData = JSON.parse(event.data)
        if (eventData.data && eventData.data.eventName) {
          this.messageEventHandller(eventData.data.eventName, eventData.data.data)
        }
      };

      socket.onerror = (event: Event) => {
        console.log("onerror");
      };

      socket.onclose = (event: CloseEvent) => {
        console.log("onclose");
      };
    })
  }

  connected(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  join(session) {
    this.emit(IcpEvents.SESSION_JOIN, session);
  }

  leave(session) {
    this.emit(IcpEvents.SESSION_LEAVE, session);
    this.subscription.unsubscribe();
  }

  emit(event: string, data: any) {
    this.socket.send(JSON.stringify({
      type: "event",
      event,
      data
    }));
  }

  listen(event: IcpEvents): Observable<any> {
    switch (event) {
      case IcpEvents.SESSION_JOINED: {
        return this.sessionJoined$.asObservable();
      }
      case IcpEvents.PRESENTER_UPDATED: {
        return this.presenterUpdated$.asObservable();
      }
      case IcpEvents.CLIENT_DISCONNECTED: {
        return this.clientDisconnected$.asObservable();
      }
      case IcpEvents.PARTICIPANTS_UPDATED: {
        return this.participantUpdated$.asObservable();
      }
      case IcpEvents.NEW_PARTICIPANT_JOINED: {
        return this.newParticipantJoined$.asObservable();
      }
      case IcpEvents.SCREEN_UPDATED: {
        return this.screenUpdated$.asObservable();
      }
      default: {
        //statements;
        break;
      }
    }
  }

  messageEventHandller(eventName: string, data: any) {
    switch (eventName) {
      case IcpEvents.SESSION_JOINED: {
        this.sessionJoined$.next(data);
        break;
      }
      case IcpEvents.PRESENTER_UPDATED: {
        this.presenterUpdated$.next(data);
        break;
      }
      case IcpEvents.CLIENT_DISCONNECTED: {
        this.clientDisconnected$.next();
        break;
      }
      case IcpEvents.PARTICIPANTS_UPDATED: {
        this.participantUpdated$.next(data);
        break;
      }
      case IcpEvents.NEW_PARTICIPANT_JOINED: {
        this.newParticipantJoined$.next();
        break;
      }
      case IcpEvents.SCREEN_UPDATED: {
        this.screenUpdated$.next(data);
        break;
      }
    }
  }

  getSocketClient(url: string): Observable<WebSocket> {
    this.socket = new WebSocket(url, 'json.webpubsub.azure.v1');
    return of(this.socket);
  }
}
