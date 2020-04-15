import { ViewerUtilService } from './viewer-util.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { ViewerException } from './viewer-exception.model';

describe('ViewerUtilService', () => {
  let service: ViewerUtilService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ViewerUtilService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.get(ViewerUtilService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created',
    inject([ViewerUtilService],
      (viewerUtilService: ViewerUtilService) => {
    expect(viewerUtilService).toBeTruthy();
  }));

  it('should make http head request', () => {
    const url = 'url';
    service.validateFile(url).subscribe(() => {
      return new Observable<ViewerException>();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('HEAD');
    req.flush(null);
  });
});
