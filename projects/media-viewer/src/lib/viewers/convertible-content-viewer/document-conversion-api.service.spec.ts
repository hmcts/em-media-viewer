import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { DocumentConversionApiService } from './document-conversion-api.service';

describe('DocumentConversionApiService', () => {
  let httpMock: HttpTestingController;
  let api: DocumentConversionApiService;
  const blob = new Blob(['blob'], { type : 'application/pdf' });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentConversionApiService],
      imports: [HttpClientTestingModule]
    });
    api = TestBed.inject(DocumentConversionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should convert', fakeAsync((done) => {
    api.convert('document-id').subscribe((response) => {
      expect(response.body.type).toEqual('application/pdf');
    }, error => done(error));

    const req = httpMock.expectOne('/doc-assembly/convert/document-id');
    expect(req.request.method).toBe('POST');
    req.flush(blob);
  }));
});
