import { inject, TestBed } from '@angular/core/testing';
import { PrintService } from './print.service';

describe('PrintService', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
          providers: [PrintService]
        });
      });

    describe('constructor', () => {

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
    });
});
