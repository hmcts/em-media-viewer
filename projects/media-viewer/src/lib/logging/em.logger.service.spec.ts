import { EmLoggerService } from './em-logger.service';
import { TestBed, inject } from '@angular/core/testing';

describe('EmLoggerService', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          EmLoggerService,
        ]
      });
    });

    describe('constructor', () => {
      it('should be created', inject([EmLoggerService], (service: EmLoggerService) => {
        expect(service).toBeTruthy();
      }));
    });

    describe('error', () => {
        it('should prepend error to the message', inject([EmLoggerService], (service: EmLoggerService) => {
            spyOn(service, 'log').and.callFake(message => {
                expect(message).toContain('error');
            });
            service.error('mymessage');
        }));
    });

    describe('info', () => {
        it('should prepend info to the message', inject([EmLoggerService], (service: EmLoggerService) => {
            spyOn(service, 'log').and.callFake(message => {
                expect(message).toContain('info');
            });
            service.info('mymessage');
        }));
    });

});
