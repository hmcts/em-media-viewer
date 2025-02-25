import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IcpSessionApiService } from './icp-session-api.service';
import { IcpSession } from './icp.interfaces';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';

describe('IcpSessionApiService', () => {

  let httpMock: HttpTestingController;
  let api: IcpSessionApiService;

  const caseId = 'caseId';
  const documentId = 'documentId';
  const session: IcpSession = {
    caseId: 'caseId',
    documentId: documentId,
    sessionId: 'sessionId',
    dateOfHearing: new Date(),
    connectionUrl: ''
  };
  const username = 'name';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IcpSessionApiService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    api = TestBed.inject(IcpSessionApiService);
    api.ICP_SESSION_API = '/my-context-path';
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([IcpSessionApiService], (service: IcpSessionApiService) => {
    expect(service).toBeTruthy();
  }));

  it('load icp session', fakeAsync((done) => {
    api.loadSession({ caseId: 'caseId', documentId: 'documentId' })
      .subscribe(response => {
        expect(response.username).toBe(username);
        expect(response.session).toBe(session);
      }, error => done(error));

    const req = httpMock.expectOne(`/my-context-path/${caseId}/${documentId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ session, username });
  }));
});
