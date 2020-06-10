import { SocketService } from './socket.service';
import any = jasmine.any;
import { Observable } from 'rxjs';

describe('SocketService', () => {

  let socketService: SocketService

  const mockSocketClient = {
    on: () => {},
    off: () => {},
    emit: () => {}
  } as any;

  beforeEach(() => {
    socketService = new SocketService();
    spyOn(socketService, 'getSocketClient').and.returnValue(mockSocketClient);
    spyOnAllFunctions(mockSocketClient);
    socketService.connect();
  })

  it('should connect', () => {
    expect(mockSocketClient.on.calls.allArgs()).toEqual([
      ['connect', any(Function)],
      ['disconnect', any(Function)]
    ]);
  });

  it('should join', () => {
    socketService.join({})
    socketService.connected$.next(true);

    expect(mockSocketClient.emit).toHaveBeenCalledWith('join', {});
  });

  it('should leave', () => {
    socketService.subscription = { unsubscribe: () => {}} as any;
    spyOn(socketService.subscription, 'unsubscribe')
    socketService.leave({});

    expect(mockSocketClient.emit).toHaveBeenCalledWith('leave', {});
    expect(socketService.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should emit', () => {
    socketService.emit('event', {});

    expect(mockSocketClient.emit).toHaveBeenCalledWith('event', {});
  });

  it('should listen', function () {
    const observable = socketService.listen({} as any);

    expect(observable).toEqual(any(Observable))
  });

  it('should unsubscribe', () => {
    socketService.subscription = { unsubscribe: () => {}} as any;
    spyOn(socketService.subscription, 'unsubscribe')

    socketService.ngOnDestroy();

    expect(socketService.subscription.unsubscribe).toHaveBeenCalled();
  });
})

