import { Injectable, OnDestroy } from '@angular/core';
import { IcpParticipant, IcpState } from './icp.interfaces';
import { Subscription } from 'rxjs';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewers/viewer-event.service';
import { IcpUpdateService } from './icp-update.service';
import { IcpPresenterService } from './icp-presenter.service';
import { IcpFollowerService } from './icp-follower.service';
import { select, Store } from '@ngrx/store';
import * as fromIcpActions from '../store/actions/icp.actions';
import * as fromIcpSelectors from '../store/selectors/icp.selectors';
import * as fromDocument from '../store/selectors/document.selectors';
import { filter, take } from 'rxjs/operators';
import { IcpEventService } from '../toolbar/icp-event.service';

@Injectable({ providedIn: 'root' })
export class IcpService implements OnDestroy {

  caseId: string;
  client: IcpParticipant;
  presenter: IcpParticipant;
  isPresenter: boolean;
  documentId: string;

  subscription: Subscription;
  sessionSubscription: Subscription;

  constructor(private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly socketService: IcpUpdateService,
    private readonly presenterSubscriptions: IcpPresenterService,
    private readonly followerSubscriptions: IcpFollowerService,
    private store: Store<IcpState>,
    private readonly icpEventService: IcpEventService) {
    this.subscription = this.store.pipe(select(fromIcpSelectors.getCaseId), filter(value => !!value)).subscribe(caseId => {
      this.caseId = caseId;
    });
    this.subscription.add(this.store.pipe(select(fromDocument.getDocumentId)).subscribe(docId => this.documentId = docId));
    this.subscription.add(this.icpEventService.sessionLaunch.subscribe(() => {

      if (this.caseId && this.documentId) { this.launchSession(); }
    }));
  }

  ngOnDestroy() {
    this.unsubscribeSession();
    this.subscription.unsubscribe();
  }

  launchSession() {
    this.store.dispatch(new fromIcpActions.LoadIcpSession({ caseId: this.caseId, documentId: this.documentId }));
    this.subscription.add(this.store.pipe(select(fromIcpSelectors.getIcpSession),
      filter(value => !!value && Object.keys(value).length > 1),
      take(1)).subscribe(() => { this.setUpSessionSubscriptions(); }));
  }

  setUpSessionSubscriptions() {
    this.sessionSubscription = this.icpEventService.becomingPresenter.subscribe(() => this.becomePresenter());
    this.sessionSubscription.add(this.icpEventService.stoppingPresenting.subscribe(() => this.stopPresenting()));
    this.sessionSubscription.add(this.icpEventService.sessionExitConfirmed.subscribe(() => this.leavePresentation()));
    this.sessionSubscription.add(
      this.store.pipe(select(fromIcpSelectors.getPresenter)).subscribe(presenter => this.presenter = presenter)
    );
    this.sessionSubscription.add(this.store.pipe(select(fromIcpSelectors.getClient)).subscribe(client => this.client = client));
    this.sessionSubscription.add(this.store.pipe(select(fromIcpSelectors.isPresenter)).subscribe(isPresenter => {
      this.isPresenter = isPresenter;
      this.presenterSubscriptions.update(isPresenter);
      this.followerSubscriptions.update(!isPresenter);
    }));
    this.sessionSubscription.add(this.socketService.clientDisconnected().subscribe(cli => this.clientDisconnected(cli)));
    this.sessionSubscription.add(this.socketService.presenterUpdated().subscribe(pres => {
      this.store.dispatch(new fromIcpActions.IcpPresenterUpdated(pres));
    }));
    this.sessionSubscription.add(this.socketService.participantListUpdated().subscribe(participants => {
      this.store.dispatch(new fromIcpActions.IcpParticipantListUpdated(participants));
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
    this.removeParticipant(this.client.id);
    this.socketService.leaveSession();
    this.store.dispatch(new fromIcpActions.LeaveIcpSocketSession());
    this.unsubscribeSession();
  }

  stopPresenting() {
    const presenter: IcpParticipant = { username: '', id: '' };
    this.socketService.updatePresenter(presenter);
  }

  becomePresenter() {
    this.socketService.updatePresenter(this.client);
  }

  clientDisconnected(client) {
    if (client === this.presenter.id) {
      this.stopPresenting();
    }
    this.removeParticipant(client);
  }

  removeParticipant(participantId) {
    this.socketService.removeParticipant(participantId);
  }
}
