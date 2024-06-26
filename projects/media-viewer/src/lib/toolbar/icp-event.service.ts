import { BehaviorSubject, Subject } from 'rxjs';

  export const enabled = new BehaviorSubject(false);
  export const sessionLaunch = new Subject<void>();
  export const becomingPresenter = new Subject<void>();
  export const stoppingPresenting = new Subject<void>();
  export const leavingSession = new BehaviorSubject(false);
  export const sessionExitConfirmed = new Subject<void>();
  export const participantsListVisible = new BehaviorSubject(false);

export const launchSession = () => {
  sessionLaunch.next();
};

export const enable = () => {
  enabled.next(true);
  launchSession();
};

export const becomePresenter = () => {
  becomingPresenter.next();
};

export const stopPresenting = () => {
  stoppingPresenting.next();
};

export const leaveSession = () => {
  leavingSession.next(true);
};

export const confirmExit = () => {
  sessionExitConfirmed.next();
  participantsListVisible.next(false);
  enabled.next(false);
};
