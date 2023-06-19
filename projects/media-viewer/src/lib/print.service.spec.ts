import { fakeAsync, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { PrintService } from './print.service';

describe('PrintService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintService]
    });
  });

  it('should be created', inject([PrintService], (service: PrintService) => {
    expect(service).toBeTruthy();
  }));

  it('should trigger native document print', fakeAsync(inject([PrintService], (service: PrintService) => {
    const windowMock = { print: () => { }, focus } as Window;
    const windowSpy = spyOn(window, 'open').and.returnValue(windowMock);
    const focusSpy = spyOn(windowMock, 'focus');
    const printSpy = spyOn(windowMock, 'print');
    service.printDocumentNatively('url');
    tick(3000);

    expect(windowSpy).toHaveBeenCalledWith('url');
    expect(focusSpy).toHaveBeenCalled();
    expect(printSpy).toHaveBeenCalled()
  })));

  it('should print an element in a new window', inject([PrintService], (service: PrintService) => {
    const windowMock = {
      print: () => { },
      focus: () => { },
      close: () => { },
      document: {
        close: () => { },
        write: () => { },
        body: {
          appendChild: () => { }
        }
      }
    } as unknown as Window;

    const windowSpy = spyOn(window, 'open').and.returnValue(windowMock);
    const printSpy = spyOn(windowMock, 'print');
    const writeSpy = spyOn(windowMock.document.body, 'appendChild');
    const element = document.createElement('p');
    element.innerText = 'Hello';

    service.printElementNatively(element, 100, 100);

    expect(windowSpy).toHaveBeenCalledWith('', '', `left=0,top=0,width=100,height=100,toolbar=0,scrollbars=0,status=0`);
    expect(printSpy).toHaveBeenCalled();
    expect(writeSpy).toHaveBeenCalledWith(element);
  }));

});

