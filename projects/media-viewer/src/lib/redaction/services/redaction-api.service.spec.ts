import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { RedactionApiService } from './redaction-api.service';

describe('RedactionApiService', () => {
  let httpMock: HttpTestingController;
  let api: RedactionApiService;
  const redaction = { redactionId: 'redaction-id', documentId: 'document-id', page: 1, rectangles: [] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedactionApiService],
      imports: [HttpClientTestingModule]
    });
    api = TestBed.get(RedactionApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('get redaction markups', fakeAsync((done) => {
    api.getRedactions('document-id')
      .subscribe((response) => {
        expect(response.body[0].documentId).toBe('document-id');
        }, error => done(error));

    const req = httpMock.expectOne('/api/markups/document-id');
    expect(req.request.method).toBe('GET');
    req.flush([redaction]);
  }));

  it('should save redaction markup', fakeAsync((done) => {
    api.saveRedaction(redaction).subscribe((response) => {
      expect(response.documentId).toEqual('document-id');
    }, error => done(error));

    const req = httpMock.expectOne('/api/markups');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.documentId).toBe('document-id');
    expect(req.request.body.redactionId).toBe('redaction-id');
    expect(req.request.body.page).toBe(1);
    req.flush(redaction);
  }));

  it('should delete redaction markup', fakeAsync((done) => {
    api.deleteRedaction(redaction).subscribe((response) => {
      expect(response).toEqual(null);
    }, error => done(error));

    const req = httpMock.expectOne('/api/markups/document-id/redaction-id');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  }));

  it('should delete all markers', fakeAsync((done) => {
    api.deleteAllMarkers('document-id').subscribe((response) => {
      expect(response).toEqual(null);
    }, error => done(error));

    const req = httpMock.expectOne('/api/markups/document-id');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  }));

  it('should apply redactions', fakeAsync((done) => {
    const blobResp = new Blob(['blob'], { type : 'application/json' });
    const redactPaylod = { redactions: [redaction], documentId: 'document-id' };
    api.redact(redactPaylod).subscribe((response) => {
      expect(response.body).toEqual(blobResp);
    }, error => done(error));

    const req = httpMock.expectOne('/api/redaction');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.documentId).toBe('document-id');
    expect(req.request.body).toBe(redactPaylod);
    req.flush(blobResp);
  }));
});
