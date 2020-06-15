import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { select, Store } from '@ngrx/store';
import * as fromIcpSelectors from '../store/selectors/icp.selectors';
import * as fromIcpActions from '../store/actions/icp.action';
import { Subscription } from 'rxjs';
import { IcpUpdateService } from './icp-update.service';
import { ViewerEventService } from '../viewers/viewer-event.service';
import { IcpPresenterService } from './icp-presenter.service';
import { IcpFollowerService } from './icp-follower.service';
import { filter, take } from 'rxjs/operators';
import { IcpParticipant, IcpState } from './icp.interfaces';


@Directive({
  selector: '[inCourtPresentation]'
})
export class IcpDirective implements OnInit, OnDestroy {

  @Input() caseId: string;

  client: IcpParticipant;
  presenter: IcpParticipant;
  isPresenter: boolean;

  subscription: Subscription;
  sessionSubscription: Subscription;

  constructor(private readonly toolbarEvents: ToolbarEventService,
              private readonly viewerEvents: ViewerEventService,
              private readonly socketService: IcpUpdateService,
              private readonly presenterSubscriptions: IcpPresenterService,
              private readonly followerSubscriptions: IcpFollowerService,
              private store: Store<IcpState>) {}

  ngOnInit() {
    this.subscription = this.toolbarEvents.icp.sessionLaunch.subscribe(() => this.launchSession());
  }

  ngOnDestroy() {
    this.unsubscribeSession();
    this.subscription.unsubscribe();
  }

  launchSession() {
    this.store.dispatch(new fromIcpActions.LoadIcpSession(this.caseId));
    this.store.pipe(select(fromIcpSelectors.getIcpSession), filter(value => !!value), take(1))
      .subscribe(() => this.setUpSessionSubscriptions());
  }

  setUpSessionSubscriptions() {
    this.sessionSubscription = this.toolbarEvents.icp.becomingPresenter.subscribe(() => this.becomePresenter())
      .add(this.toolbarEvents.icp.stoppingPresenting.subscribe(() => this.stopPresenting()))
      .add(this.toolbarEvents.icp.sessionExitConfirmed.subscribe(() => this.leavePresentation()))
      .add(this.store.pipe(select(fromIcpSelectors.getPresenter)).subscribe(presenter => this.presenter = presenter ))
      .add(this.store.pipe(select(fromIcpSelectors.getClient)).subscribe(client => this.client = client))
      .add(this.store.pipe(select(fromIcpSelectors.isPresenter)).subscribe(isPresenter => {
        this.isPresenter = isPresenter;
        this.presenterSubscriptions.update(isPresenter);
        this.followerSubscriptions.update(!isPresenter);
      }))
      .add(this.socketService.clientDisconnected().subscribe(cli => this.clientDisconnected(cli)))
      .add(this.socketService.presenterUpdated().subscribe(pres => {
        this.store.dispatch(new fromIcpActions.IcpPresenterUpdated(pres));
      }));
  }

  unsubscribeSession() {
    this.presenterSubscriptions.update(false);
    this.followerSubscriptions.update(false);
    this.sessionSubscription.unsubscribe();
  }

  leavePresentation() {
    if (this.isPresenter) {
      this.stopPresenting();
    }
    this.socketService.leaveSession();
    this.store.dispatch(new fromIcpActions.LeaveIcpSocketSession());
    this.unsubscribeSession();
  }

  stopPresenting() {
    const presenter: IcpParticipant = {username: '', id: ''};
    this.socketService.updatePresenter(presenter);
  }

  becomePresenter() {
    this.socketService.updatePresenter(this.client);
  }

  clientDisconnected(client) {
    if (client === this.presenter.id) {
      this.stopPresenting();
    }
  }
}
