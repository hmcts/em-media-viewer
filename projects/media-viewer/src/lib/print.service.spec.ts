import { inject, TestBed } from '@angular/core/testing';
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

  it('should trigger native document print', inject([PrintService], (service: PrintService) => {
    const windowMock = { print: () => {}} as Window;
    const windowSpy = spyOn(window, 'open').and.returnValue(windowMock);
    const printSpy = spyOn(windowMock, 'print');
    service.printDocumentNatively('url');

    expect(windowSpy).toHaveBeenCalledWith('url');
    expect(printSpy).toHaveBeenCalled();
  }));

  it('should print an element in a new window', inject([PrintService], (service: PrintService) => {
    const windowMock = {
      print: () => {},
      focus: () => {},
      close: () => {},
      document: {
        close: () => {},
        write: () => {}
      }
    } as Window;

    const windowSpy = spyOn(window, 'open').and.returnValue(windowMock);
    const printSpy = spyOn(windowMock, 'print');
    const writeSpy = spyOn(windowMock.document, 'write');
    const element = document.createElement('p');
    element.innerText = 'Hello';

    service.printElementNatively(element, 100, 100);

    expect(windowSpy).toHaveBeenCalledWith('', '', `left=0,top=0,width=100,height=100,toolbar=0,scrollbars=0,status=0`);
    expect(printSpy).toHaveBeenCalled();
    expect(writeSpy).toHaveBeenCalledWith('Hello');
  }));

});

