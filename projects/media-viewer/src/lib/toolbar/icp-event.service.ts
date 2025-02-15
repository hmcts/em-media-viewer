import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IcpEventService {

  enabled = new BehaviorSubject(false);
  sessionLaunch = new Subject<void>();
  becomingPresenter = new Subject<void>();
  stoppingPresenting = new Subject<void>();
  leavingSession = new BehaviorSubject(false);
  sessionExitConfirmed = new Subject<void>();
  participantsListVisible = new BehaviorSubject(false);

  constructor() { }

  launchSession = () => {
    this.sessionLaunch.next();
  };

  enable = () => {
    this.enabled.next(true);
    this.launchSession();
  };

  becomePresenter = () => {
    this.becomingPresenter.next();
  };

  stopPresenting = () => {
    this.stoppingPresenting.next();
  };

  leaveSession = () => {
    this.leavingSession.next(true);
  };

  confirmExit = () => {
    this.sessionExitConfirmed.next();
    this.participantsListVisible.next(false);
    this.enabled.next(false);
  };
}
