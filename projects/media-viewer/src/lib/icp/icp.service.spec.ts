import { IcpService } from './icp.service';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { IcpUpdateService } from './icp-update.service';
import { SocketService } from './socket.service';
import { IcpPresenterService } from './icp-presenter.service';
import { IcpFollowerService } from './icp-follower.service';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from '../store/reducers/reducers';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { IcpParticipant, IcpSession } from './icp.interfaces';
import * as fromIcpActions from '../store/actions/icp.action';
import { of, Subscription } from 'rxjs';

describe('Icp Service', () => {

  let service: IcpService;
  let updateService: IcpUpdateService;
  let presenterService: IcpPresenterService;
  let followerService: IcpFollowerService;
  const mockParticipantService = {
    update: () => {
    }
  } as any;
  const mockUpdateService = {
    clientDisconnected: () => of('client'),
    presenterUpdated: () => of(),
    participantListUpdated: () => of(),
    leaveSession: () => {},
    updatePresenter: () => {},
    screenUpdated: () => {},
    removeParticipant: () => {},
  } as any;

  const session: IcpSession = {
    caseId: 'caseId',
    sessionId: 'sessionId',
    dateOfHearing: new Date()
  };
  const participant: IcpParticipant = {
    id: 'id',
    username: 'name'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [IcpService,
        SocketService,
        {provide: IcpUpdateService, useValue: mockUpdateService},
        {provide: IcpPresenterService, useValue: mockParticipantService},
        {provide: IcpFollowerService, useValue: mockParticipantService},
      ]
    });
    service = TestBed.get(IcpService);
    updateService = TestBed.get(IcpUpdateService);
    presenterService = TestBed.get(IcpPresenterService);
    followerService = TestBed.get(IcpFollowerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe to case id in store',
    inject([Store], fakeAsync((store) => {
      const action = new fromIcpActions.SetCaseId('caseId');
      store.dispatch(action);

      expect(service.caseId).toEqual('caseId');
    }))
  );

  it('should subscribe to the sessionLaunch event',
    inject([Store, ToolbarEventService], fakeAsync((store, toolbarEvents) => {
      spyOn(service, 'launchSession');
      service.caseId = 'caseId';

      toolbarEvents.icp.sessionLaunch.next();

      expect(service.launchSession).toHaveBeenCalled();
    }))
  );

  it('should load icp session on session launch',
    inject([Store], fakeAsync((store) => {
      spyOn(store, 'dispatch');

      service.caseId = 'caseId';
      service.launchSession();

      expect(store.dispatch).toHaveBeenCalledWith(new fromIcpActions.LoadIcpSession('caseId'));
    }))
  );

  it('should subscribe to icp session store when session launched',
    inject([Store], fakeAsync((store) => {
      spyOn(service, 'setUpSessionSubscriptions');

      service.caseId = 'caseId';
      service.launchSession();

      const payload = {session: session, participantInfo: {client: participant, presenter: participant}};
      const action = new fromIcpActions.IcpSocketSessionJoined(payload);
      store.dispatch(action);

      expect(service.setUpSessionSubscriptions).toHaveBeenCalled();
    }))
  );

  it('should set up session subscriptions when session launched',
    inject([ToolbarEventService, Store], fakeAsync((toolbarEvents, store) => {
      spyOn(service, 'becomePresenter');
      spyOn(service, 'stopPresenting');
      spyOn(service, 'leavePresentation');
      spyOn(presenterService, 'update');
      spyOn(followerService, 'update');
      spyOn(service, 'clientDisconnected');

      service.setUpSessionSubscriptions();
      toolbarEvents.icp.becomingPresenter.next();
      toolbarEvents.icp.stoppingPresenting.next();
      toolbarEvents.icp.sessionExitConfirmed.next();
      const payload = {session: session, participantInfo: {client: participant, presenter: participant}};
      const action = new fromIcpActions.IcpSocketSessionJoined(payload);
      store.dispatch(action);
      mockUpdateService.clientDisconnected();

      expect(service.becomePresenter).toHaveBeenCalled();
      expect(service.stopPresenting).toHaveBeenCalled();
      expect(service.leavePresentation).toHaveBeenCalled();
      expect(service.presenter).toEqual(participant);
      expect(service.client).toEqual(participant);
      expect(service.isPresenter).toEqual(true);
      expect(presenterService.update).toHaveBeenCalled();
      expect(followerService.update).toHaveBeenCalled();
      expect(service.clientDisconnected).toHaveBeenCalled();
    }))
  );

  it('should unsubscribe from session subscriptions when session destroyed', () => {
    service.sessionSubscription = new Subscription();

    spyOn(service.sessionSubscription, 'unsubscribe');
    spyOn(presenterService, 'update');
    spyOn(followerService, 'update');

    service.unsubscribeSession();

    expect(presenterService.update).toHaveBeenCalled();
    expect(followerService.update).toHaveBeenCalled();
    expect(service.sessionSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should destroy subscriptions', () => {
    service.subscription = new Subscription();
    service.sessionSubscription = new Subscription();

    spyOn(service.subscription, 'unsubscribe');
    spyOn(service, 'unsubscribeSession');

    service.ngOnDestroy();

    expect(service.unsubscribeSession).toHaveBeenCalled();
    expect(service.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should leave presentation',
    inject([Store], fakeAsync((store) => {
      spyOn(service, 'stopPresenting');
      spyOn(service, 'unsubscribeSession');
      spyOn(service, 'removeParticipant');
      spyOn(updateService, 'leaveSession');
      spyOn(store, 'dispatch');

      service.isPresenter = true;
      service.sessionSubscription = new Subscription();
      service.client = { id: 'clientId', username: 'name' };
      service.leavePresentation();

      expect(service.stopPresenting).toHaveBeenCalled();
      expect(service.unsubscribeSession).toHaveBeenCalled();
      expect(service.removeParticipant).toHaveBeenCalledWith(service.client.id);
      expect(updateService.leaveSession).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(new fromIcpActions.LeaveIcpSocketSession());
    }))
  );

  it('should stop presenting', () => {
    spyOn(updateService, 'updatePresenter');

    service.stopPresenting();

    expect(updateService.updatePresenter).toHaveBeenCalled();
  });

  it('should become presenter', () => {
    spyOn(updateService, 'updatePresenter');

    service.client = participant;
    service.becomePresenter();

    expect(updateService.updatePresenter).toHaveBeenCalled();
  });

  it('should call stop presenting if client disconnected is presenter', () => {
    spyOn(service, 'stopPresenting');

    service.presenter = participant;
    service.clientDisconnected(participant.id);

    expect(service.stopPresenting).toHaveBeenCalled();
  });

  it('should remove participant', () => {
    spyOn(updateService, 'removeParticipant');

    service.removeParticipant(participant.id);

    expect(updateService.removeParticipant).toHaveBeenCalled();
  });
});
