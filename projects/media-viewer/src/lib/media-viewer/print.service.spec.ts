import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransferState } from '@angular/platform-browser';
import { EmLoggerService } from '../logging/em-logger.service';
import { PrintService } from './print.service';

describe('PrintService', () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({
          providers: [
              EmLoggerService,
              PrintService,
              TransferState,
              EmLoggerService
            ],
            imports: [HttpClientTestingModule]
        });

        httpMock = TestBed.get(HttpTestingController);

      });

    describe('constructor', () => {
        it('should be created', inject([PrintService], (service: PrintService) => {
          expect(service).toBeTruthy();
        }));
    });

});

