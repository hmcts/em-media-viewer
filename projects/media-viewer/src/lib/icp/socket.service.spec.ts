import { SocketService } from './socket.service';
import { Observable, of } from 'rxjs';
import { IcpEvents } from './icp.events';

describe('SocketService', () => {

  let socketService: SocketService;

  const mockSocketClient: any = {
    readyState: WebSocket.OPEN,
    onclose: () => { },
    onerror: () => { },
    onmessage: () => { },
    onopen: () => { },
    send: (data: any) => { },
  };

  beforeEach(() => {
    socketService = new SocketService();
    spyOn(socketService, 'getSocketClient').and.returnValue(of(mockSocketClient));
    spyOnAllFunctions(mockSocketClient);
    socketService.connect('http://testurl.com', {
      sessionId: 'dummy-session-id',
      documentId: 'dummy-document-id',
      caseId: 'dummy-case-id',
      dateOfHearing: undefined,
      connectionUrl: 'dummy-connection-url'
    });
  });

  it('should join', () => {
    spyOn(socketService, 'emit');
    socketService.join({});
    expect(socketService.emit).toHaveBeenCalledWith('IcpClientJoinSession', {});
  });

  it('should leave', () => {
    socketService.subscription = { unsubscribe: () => { } } as any;
    spyOn(socketService.subscription, 'unsubscribe');
    spyOn(socketService, 'emit');
    socketService.leave({});

    expect(socketService.emit).toHaveBeenCalledWith('IcpClientLeaveSession', {});
    expect(socketService.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should emit', () => {
    socketService['socket'] = mockSocketClient;
    socketService.emit('event', {});
    expect(mockSocketClient.send).toHaveBeenCalledWith('{"type":"event","event":"event","data":{}}');
  });


  it('should listen', function () {
    const observable = socketService.listen(IcpEvents.PARTICIPANTS_UPDATED);
    expect(observable).toEqual(jasmine.any(Observable));
  });

  it('should unsubscribe', () => {
    socketService.subscription = { unsubscribe: () => { } } as any;
    spyOn(socketService.subscription, 'unsubscribe');
    socketService.ngOnDestroy();
    expect(socketService.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('message event handler should call session joined', () => {
    const nextSpy = spyOn(socketService.sessionJoined$, 'next');
    socketService.messageEventHandller('IcpClientJoinedSession', { test: 'hello' });
    expect(nextSpy).toHaveBeenCalled();
  });

  it('message event handler should call presenter updated', () => {
    const nextSpy = spyOn(socketService.presenterUpdated$, 'next');
    socketService.messageEventHandller('IcpPresenterUpdated', { test: 'hello' });
    expect(nextSpy).toHaveBeenCalled();
  });

  it('message event handler should call client disconnected', () => {
    const nextSpy = spyOn(socketService.clientDisconnected$, 'next');
    socketService.messageEventHandller('IcpClientDisconnectedFromSession', { test: 'hello' });
    expect(nextSpy).toHaveBeenCalled();
  });

  it('message event handler should call participant updated', () => {
    const nextSpy = spyOn(socketService.participantUpdated$, 'next');
    socketService.messageEventHandller('IcpParticipantsListUpdated', { test: 'hello' });
    expect(nextSpy).toHaveBeenCalled();
  });

  it('message event handler should call new participant joined', () => {
    const nextSpy = spyOn(socketService.newParticipantJoined$, 'next');
    socketService.messageEventHandller('IcpNewParticipantJoinedSession', { test: 'hello' });
    expect(nextSpy).toHaveBeenCalled();
  });

  it('message event handler should call screen updated', () => {
    const nextSpy = spyOn(socketService.screenUpdated$, 'next');
    socketService.messageEventHandller('IcpScreenUpdated', { test: 'hello' });
    expect(nextSpy).toHaveBeenCalled();
  });

  it('listen should call session joined', () => {
    const nextSpy = spyOn(socketService.sessionJoined$, 'asObservable');
    socketService.listen(IcpEvents.SESSION_JOINED);
    expect(nextSpy).toHaveBeenCalled();
  });

  it('listen should call presenter updated', () => {
    const nextSpy = spyOn(socketService.presenterUpdated$, 'asObservable');
    socketService.listen(IcpEvents.PRESENTER_UPDATED);
    expect(nextSpy).toHaveBeenCalled();
  });

  it('listen should call client disconnected', () => {
    const nextSpy = spyOn(socketService.clientDisconnected$, 'asObservable');
    socketService.listen(IcpEvents.CLIENT_DISCONNECTED);
    expect(nextSpy).toHaveBeenCalled();
  });

  it('listen should call new participant joined', () => {
    const nextSpy = spyOn(socketService.newParticipantJoined$, 'asObservable');
    socketService.listen(IcpEvents.NEW_PARTICIPANT_JOINED);
    expect(nextSpy).toHaveBeenCalled();
  });

  it('listen should call screen updated', () => {
    const nextSpy = spyOn(socketService.screenUpdated$, 'asObservable');
    socketService.listen(IcpEvents.SCREEN_UPDATED);
    expect(nextSpy).toHaveBeenCalled();
  });

  it('connected should be observable', () => {
    const nextSpy = spyOn(socketService.connected$, 'asObservable');
    socketService.connected();
    expect(nextSpy).toHaveBeenCalled();
  });

});

