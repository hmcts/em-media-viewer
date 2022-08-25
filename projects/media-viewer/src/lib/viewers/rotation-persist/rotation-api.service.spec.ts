import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { RotationApiService } from './rotation-api.service';

describe('RotationApiService', () => {
  let httpMock: HttpTestingController;
  let api: RotationApiService;
  const rotation = { documentId: 'document-id', rotationAngle: 90 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RotationApiService],
      imports: [HttpClientTestingModule]
    });
    api = TestBed.get(RotationApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should get rotation', fakeAsync((done) => {
    api.getRotation('document-id')
      .subscribe((response) => {
        expect(response.body.rotationAngle).toBe(90);
        }, error => done(error));

    const req = httpMock.expectOne('/em-anno/metadata/document-id');
    expect(req.request.method).toBe('GET');
    req.flush(rotation);
  }));

  it('should save rotation', fakeAsync((done) => {
    api.saveRotation(rotation).subscribe((response) => {
      expect(response.body.rotationAngle).toEqual(90);
    }, error => done(error));

    const req = httpMock.expectOne('/em-anno/metadata/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.documentId).toBe('document-id');
    expect(req.request.body.rotationAngle).toBe(90);
    req.flush(rotation);
  }));
});
