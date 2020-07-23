import { TestBed, inject } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { IcpUpdateService } from './icp-update.service';
import { IcpParticipant, IcpScreenUpdate, IcpSession } from './icp.interfaces';

describe('UpdateService', () => {

  let updateService: IcpUpdateService;

  const username = 'name';
  const session: IcpSession = {
    caseId: 'caseId',
    sessionId: 'sessionId',
    dateOfHearing: new Date()
  };
  const participant: IcpParticipant = {
    id: 'id',
    username: 'name'
  };
  const screen: IcpScreenUpdate = {
    pdfPosition: {
      pageNumber: 1,
      top: 1,
      left: 1,
      rotation: 1
    },
    document: 'document'
  };

  const mockSocketService = {
    connect: () => {},
    join: () => {},
    leave: () => {},
    emit: () => {},
    listen: () => {},
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IcpUpdateService, { provide: SocketService, useValue: mockSocketService }]
    });

    updateService = TestBed.get(IcpUpdateService);
  });

  it('should be created', inject([IcpUpdateService], (service: IcpUpdateService) => {
    expect(service).toBeTruthy();
  }));

  it('should join session',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'connect');
      spyOn(socketService, 'join');
      spyOn(socketService, 'listen');

      updateService.joinSession(username, session);
      expect(updateService.session).toEqual(session);
      expect(socketService.connect).toHaveBeenCalled();
      expect(socketService.join).toHaveBeenCalled();
      expect(socketService.listen).toHaveBeenCalled();
    }));

  it('should leave session',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'leave');

      updateService.leaveSession();
      expect(socketService.leave).toHaveBeenCalled();
    }));

  it('listen for new participant',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'listen');

      updateService.newParticipantJoined();
      expect(socketService.listen).toHaveBeenCalled();
    }));

  it('listen for client disconnecting',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'listen');

      updateService.clientDisconnected();
      expect(socketService.listen).toHaveBeenCalled();
    }));

  it('emit event when updating presenter',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'emit');

      updateService.updatePresenter(participant);
      expect(socketService.emit).toHaveBeenCalled();
    }));

  it('listen for presenter updates',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'listen');

      updateService.presenterUpdated();
      expect(socketService.listen).toHaveBeenCalled();
    }));

  it('emit update screen event',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'emit');

      updateService.session = session;
      updateService.updateScreen(screen);
      expect(socketService.emit).toHaveBeenCalled();
    }));

  it('listen for screen updates',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'listen');

      updateService.screenUpdated();
      expect(socketService.listen).toHaveBeenCalled();
    }));

  it('emit remove participant event',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'emit');

      updateService.session = session;
      updateService.removeParticipant('participantId');
      expect(socketService.emit).toHaveBeenCalled();
    }));

  it('listen for participant updates',
    inject([SocketService], (socketService) => {
      spyOn(socketService, 'listen');

      updateService.participantListUpdated();
      expect(socketService.listen).toHaveBeenCalled();
    }));
});
