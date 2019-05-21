import { TestBed, inject } from '@angular/core/testing';
import { MediaViewerService } from './media-viewer.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransferState } from '@angular/platform-browser';
import { EmLoggerService } from '../../logging/em-logger.service';

describe('MediaViewerService', () => {
    let httpMock: HttpTestingController;
    const documentUri = 'http://localhost:8080/documents/5e2971b1-ad1c-41d5-bf43-e88f45211d4e/binary';
    let mockDocuments;

    beforeEach(() => {

        TestBed.configureTestingModule({
          providers: [
              EmLoggerService,
              MediaViewerService,
              TransferState,
              EmLoggerService
            ],
            imports: [HttpClientTestingModule]
        });

        mockDocuments = {
            mimeType: 'image/jpeg',
            originalDocumentName: 'image.jpeg',
            _links: {
                binary: {
                    href: `${documentUri}/binary`
                },
                self: {
                    href: `${documentUri}`
                }
            }
        };
        httpMock = TestBed.get(HttpTestingController);

      });

    describe('constructor', () => {
        it('should be created', inject([MediaViewerService], (service: MediaViewerService) => {
          expect(service).toBeTruthy();
        }));
    });

    describe('getDocumentMetadata', () => {
        afterEach(() => {
            httpMock.verify();
          });

        it('should call httpClient with documentUri', inject([MediaViewerService], (service: MediaViewerService) => {
            service.getDocumentMetadata(documentUri).subscribe(observer => {
                expect(observer.mimeType).toBe(mockDocuments.mimeType);
                expect(observer.originalDocumentName).toBe(mockDocuments.originalDocumentName);
            });
            const req = httpMock.expectOne(documentUri);
            expect(req.request.method).toBe('GET');
            req.flush(mockDocuments);
        }));

        it('should catch an error and return it', inject([MediaViewerService], (service: MediaViewerService) => {
            service.getDocumentMetadata(documentUri).subscribe();
            httpMock.expectOne(documentUri).error(new ErrorEvent('network error'));
        }));
    });
});

