import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { IcpPresenterService } from './icp-presenter.service';
import { IcpUpdateService } from './icp-update.service';
import { Store, StoreModule } from '@ngrx/store';
import { PdfPosition, reducers } from '../store/reducers/reducers';
import { IcpSocketSessionJoined } from '../store/actions/icp.action';
import { PdfPositionUpdate } from '../store/actions/document.action';
import { IcpParticipant, IcpSession } from './icp.interfaces';
import { of } from 'rxjs';

describe('Icp Presenter Service', () => {

  let presenterService: IcpPresenterService;
  let updateService: IcpUpdateService;
  const mockUpdateService = {
    newParticipantJoined: () => of('client'),
    updateScreen: () => {},
    updatePresenter: () => {},
    screenUpdated: () => {}
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
  const pdfPosition: PdfPosition = {
    pageNumber: 1,
    top: 1,
    left: 1,
    rotation: 90,
    scale: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [IcpPresenterService,
        {provide: IcpUpdateService, useValue: mockUpdateService}]
    });

    presenterService = TestBed.get(IcpPresenterService);
    updateService = TestBed.get(IcpUpdateService);
  });

  it('should be created', () => {
    expect(presenterService).toBeTruthy();
  });

  it('should call subscribe if client is presenter', () => {
    spyOn(presenterService, 'subscribe');

    presenterService.update(true);

    expect(presenterService.subscribe).toHaveBeenCalled();
  });

  it('should call unsubscribe if client is not presenter', () => {
    spyOn(presenterService, 'unsubscribe');

    presenterService.update(false);

    expect(presenterService.unsubscribe).toHaveBeenCalled();
  });

  it('should set up subscriptions',
    inject([Store], fakeAsync((store) => {
      spyOn(presenterService, 'onNewParticipantJoined');
      spyOn(presenterService, 'onPositionUpdate');

      presenterService.subscribe();

      const joinedPayload = {session: session, participantInfo: {client: participant, presenter: participant}};
      store.dispatch( new IcpSocketSessionJoined(joinedPayload));
      store.dispatch( new PdfPositionUpdate(pdfPosition));
      mockUpdateService.newParticipantJoined();

      expect(presenterService.presenter).toEqual(participant);
      expect(presenterService.pdfPosition).toEqual(pdfPosition);
      expect(presenterService.onPositionUpdate).toHaveBeenCalledWith(pdfPosition);
      expect(presenterService.onNewParticipantJoined).toHaveBeenCalled();
    }))
  );

  it('should should set subscription to undefined', () => {
    presenterService.unsubscribe();

    expect(presenterService.$subscription).toEqual(undefined);
  });

  it('should call service to update screen position', () => {
    spyOn(updateService, 'updateScreen');

    presenterService.onPositionUpdate(pdfPosition);

    expect(updateService.updateScreen).toHaveBeenCalledWith({ pdfPosition, document: undefined });
  });

  it('should call service to update screen position', () => {
    spyOn(updateService, 'updateScreen');

    presenterService.onPositionUpdate(pdfPosition);

    expect(updateService.updateScreen).toHaveBeenCalledWith({ pdfPosition, document: undefined });
  });


  it('should call service to update presenter', () => {
    spyOn(presenterService, 'onPositionUpdate');
    spyOn(updateService, 'updatePresenter');

    presenterService.pdfPosition = pdfPosition;
    presenterService.presenter = participant;
    presenterService.onNewParticipantJoined();

    expect(presenterService.onPositionUpdate).toHaveBeenCalledWith(pdfPosition);
    expect(updateService.updatePresenter).toHaveBeenCalledWith(participant);
  });
});

