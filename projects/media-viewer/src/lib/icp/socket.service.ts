import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import socketio from 'socket.io-client/dist/socket.io.slim.js';

@Injectable()
export class SocketService implements OnDestroy {

  private socket: any;
  subscription: Subscription;

  connected$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  connect() {
    this.socket = this.getSocketClient();
    this.socket.on('connect', () => this.connected$.next(true));
    this.socket.on('disconnect', () => this.connected$.next(false));
  }

  join(session) {
    this.subscription = this.connected$.subscribe(connected => {
      if (connected) {
        this.socket.emit('join', session);
      }
    });
  }

  leave(session) {
    this.socket.emit('leave', session);
    this.subscription.unsubscribe();
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  listen(event: string): Observable<any> {
    return new Observable( observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
      return () => this.socket.off(event);
    });
  }

  getSocketClient() {
    return socketio('/', {
      path: '/icp/socket.io', agent: true
    });
  }
}
