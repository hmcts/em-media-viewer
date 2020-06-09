import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IcpSessionService } from './icp-session.service';
import { IcpSession } from './icp.interfaces';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';

describe('IcpSessionService', () => {

  let httpMock: HttpTestingController;
  let icpSessionService: IcpSessionService;

  const caseId = 'caseId';
  const session: IcpSession = {
    caseId: 'caseId',
    sessionId: 'sessionId',
    dateOfHearing: new Date()
  };
  const username = 'name';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IcpSessionService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    icpSessionService = TestBed.get(IcpSessionService);
    icpSessionService.ICP_SESSION_API = '/my-context-path';
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([IcpSessionService], (service: IcpSessionService) => {
    expect(service).toBeTruthy();
  }));

  it('load icp session', fakeAsync((done) => {
    icpSessionService.loadSession(caseId)
      .subscribe(response => {
        expect(response.username).toBe(username);
        expect(response.session).toBe(session);
      }, error => done(error));

    const req = httpMock.expectOne(`/my-context-path/${caseId}`);
    expect(req.request.method).toBe('GET');
    req.flush({session, username});
  }));
});
