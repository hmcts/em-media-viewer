import { IcpDirective } from './icp.directive';
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

describe('Icp Directive', () => {

  let directive: IcpDirective;
  let updateService: IcpUpdateService;
  let presenterService: IcpPresenterService;
  let followerService: IcpFollowerService;
  const session: IcpSession = {
    caseId: 'caseId',
    sessionId: 'sessionId',
    dateOfHearing: new Date()
  };
  const participant: IcpParticipant = {
    id: 'id',
    username: 'name'
  };
  const mockParticipantService = {
    update: () => {
    }
  } as any;
  const mockUpdateService = {
    clientDisconnected: () => of('client'),
    presenterUpdated: () => of(),
    leaveSession: () => {
    },
    updatePresenter: () => {
    },
    screenUpdated: () => {
    }
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [IcpDirective,
        SocketService,
        {provide: IcpUpdateService, useValue: mockUpdateService},
        {provide: IcpPresenterService, useValue: mockParticipantService},
        {provide: IcpFollowerService, useValue: mockParticipantService},
      ]
    });
    directive = TestBed.get(IcpDirective);
    updateService = TestBed.get(IcpUpdateService);
    presenterService = TestBed.get(IcpPresenterService);
    followerService = TestBed.get(IcpFollowerService);
  });

  it('should be created', () => {
    expect(directive).toBeTruthy();
  });

  it('should subscribe to the sessionLaunch event',
    inject([ToolbarEventService], (toolbarEvents) => {
      const mockSubscription = { unsubscribe: () => {} };
      spyOn(toolbarEvents.icp.sessionLaunch, 'subscribe').and.returnValue(mockSubscription);

      directive.ngOnInit();
      expect(toolbarEvents.icp.sessionLaunch.subscribe).toHaveBeenCalled();
    })
  );

  it('should load icp session',
    inject([Store], fakeAsync((store) => {
      spyOn(store, 'dispatch');

      directive.caseId = 'caseId';
      directive.ngOnInit();
      directive.launchSession();

      expect(store.dispatch).toHaveBeenCalledWith(new fromIcpActions.LoadIcpSession('caseId'));
    }))
  );

  it('should subscribe to icp session store',
    inject([Store], fakeAsync((store) => {
      spyOn(directive, 'setUpSessionSubscriptions');

      directive.caseId = 'caseId';
      directive.ngOnInit();
      directive.launchSession();

      const payload = {session: session, participantInfo: {client: participant, presenter: participant}};
      const action = new fromIcpActions.IcpSocketSessionJoined(payload);
      store.dispatch(action);

      expect(directive.setUpSessionSubscriptions).toHaveBeenCalled();
    }))
  );

  it('should set up session subscriptions',
    inject([ToolbarEventService, Store], fakeAsync((toolbarEvents, store) => {
      spyOn(directive, 'becomePresenter');
      spyOn(directive, 'stopPresenting');
      spyOn(directive, 'leavePresentation');
      spyOn(presenterService, 'update');
      spyOn(followerService, 'update');
      spyOn(directive, 'clientDisconnected');

      directive.setUpSessionSubscriptions();
      toolbarEvents.icp.becomingPresenter.next();
      toolbarEvents.icp.stoppingPresenting.next();
      toolbarEvents.icp.sessionExitConfirmed.next();
      const payload = {session: session, participantInfo: {client: participant, presenter: participant}};
      const action = new fromIcpActions.IcpSocketSessionJoined(payload);
      store.dispatch(action);
      mockUpdateService.clientDisconnected();

      expect(directive.becomePresenter).toHaveBeenCalled();
      expect(directive.stopPresenting).toHaveBeenCalled();
      expect(directive.leavePresentation).toHaveBeenCalled();
      expect(directive.presenter).toEqual(participant);
      expect(directive.client).toEqual(participant);
      expect(directive.isPresenter).toEqual(true);
      expect(presenterService.update).toHaveBeenCalled();
      expect(followerService.update).toHaveBeenCalled();
      expect(directive.clientDisconnected).toHaveBeenCalled();
    }))
  );

  it('should unsubscribe from session subscriptions', () => {
    spyOn(presenterService, 'update');
    spyOn(followerService, 'update');
    directive.sessionSubscription = new Subscription();
    spyOn(directive.sessionSubscription, 'unsubscribe');

    directive.unsubscribeSession();

    expect(presenterService.update).toHaveBeenCalled();
    expect(followerService.update).toHaveBeenCalled();
    expect(directive.sessionSubscription.unsubscribe).toHaveBeenCalled();
  });


  it('should leave presentation',
    inject([Store], fakeAsync((store) => {
      spyOn(directive, 'stopPresenting');
      spyOn(directive, 'unsubscribeSession');
      spyOn(updateService, 'leaveSession');
      spyOn(store, 'dispatch');

      directive.isPresenter = true;
      directive.sessionSubscription = new Subscription();
      directive.leavePresentation();

      expect(directive.stopPresenting).toHaveBeenCalled();
      expect(directive.unsubscribeSession).toHaveBeenCalled();
      expect(updateService.leaveSession).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(new fromIcpActions.LeaveIcpSocketSession());
    }))
  );

  it('should stop presenting', () => {
    spyOn(updateService, 'updatePresenter');

    directive.stopPresenting();

    expect(updateService.updatePresenter).toHaveBeenCalled();
  });

  it('should become presenter', () => {
    spyOn(updateService, 'updatePresenter');

    directive.client = participant;
    directive.becomePresenter();

    expect(updateService.updatePresenter).toHaveBeenCalled();
  });

  it('should call stop presenting if client disconnected is presenter', () => {
    spyOn(directive, 'stopPresenting');

    directive.presenter = participant;
    directive.clientDisconnected(participant.id);

    expect(directive.stopPresenting).toHaveBeenCalled();
  });

});
