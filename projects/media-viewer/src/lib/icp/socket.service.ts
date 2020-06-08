import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import socketio from 'socket.io-client';

@Injectable()
export class SocketService implements OnDestroy {

  private socket: SocketIOClient.Socket;
  subscription: Subscription;

  connected$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  connect() {
    this.socket = socketio('/', { path: '/icp/socket.io', secure: false });
    this.socket.on('connect', () => this.connected$.next(true));
    this.socket.on('disconnect', () => this.connected$.next(false));
  }

  join(session) {
    // auto rejoin after reconnect mechanism
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
      // dispose of the event listener when unsubscribed
      return () => this.socket.off(event);
    });
  }
}
