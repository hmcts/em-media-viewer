import { SocketService } from './socket.service';
import { Observable, of } from 'rxjs';
import { IcpEvents } from './icp.events';

describe('SocketService', () => {

  let socketService: SocketService;

  const mockSocketClient: any = {
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
    socketService.connect('');
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
});

