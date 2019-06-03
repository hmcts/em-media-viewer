import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { AnnotationApiService } from './annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { User } from './user/user.model';
import { Annotation } from './annotation.model';


describe('AnnotationApiService', () => {
  let httpMock: HttpTestingController;
  let api: AnnotationApiService;
  const dmDocumentId = 'ad88d12c-8526-49b6-ae5e-3f7ea5d08168';
  const user: User = {
    email: 'example@example.org',
    forename: 'Forename',
    surname: 'Surname'
  };
  const annotationSet: AnnotationSet = {
    id: '1',
    annotationId: '1',
    createdBy: 'example@example.org',
    createdByDetails: user,
    createdDate: '2019-06-03T10:00:00Z',
    lastModifiedBy: 'example@example.org',
    lastModifiedByDetails: user,
    lastModifiedDate: '2019-06-03T10:00:00Z',
    documentId: dmDocumentId,
    annotations: []
  };

  const annotation: Annotation = {
    id: 'f6225689-29ab-4e0d-9bea-8519a06d16f9',
    annotationId: 'ae2133a4-8dc5-430b-bb20-5290bd801f94',
    createdBy: 'example@example.org',
    createdByDetails: user,
    createdDate: '2019-06-03T10:00:00Z',
    lastModifiedBy: 'example@example.org',
    lastModifiedByDetails: user,
    lastModifiedDate: '2019-06-03T10:00:00Z',
    documentId: dmDocumentId,
    page: 1,
    color: 'FFFF00',
    type: 'highlight',
    comments: [],
    rectangles: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnnotationApiService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    api = TestBed.get(AnnotationApiService);
    httpMock = TestBed.get(HttpTestingController);
  });


  it('should be created', inject([AnnotationApiService], (service: AnnotationApiService) => {
    expect(service).toBeTruthy();
  }));

  describe('createAnnotationSet', () => {
    it('should return IAnnotationSet response', () => {
      const requestBody = {
        documentId: dmDocumentId,
        id: '6d1f5e09-98ad-4891-aecc-936282b06148'
      };
      api.createAnnotationSet(requestBody).subscribe((response) => {
        expect(response.body.documentId).toEqual(dmDocumentId);
      });

      const req = httpMock.expectOne('/em-anno/annotation-sets');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.documentId).toBe(dmDocumentId);
      expect(req.request.body.id).toBeTruthy();
      req.flush(annotationSet);
    });
  });

  describe('fetch', () => {
    it('should return AnnotationSet response', () => {
      api.getAnnotationSet(dmDocumentId).subscribe((response) => {
        expect(response.body.documentId).toBe(dmDocumentId);
      });

      const req = httpMock.expectOne(`/em-anno/annotation-sets/filter?documentId=${dmDocumentId}`);
      expect(req.request.method).toBe('GET');
      req.flush(annotationSet);
    });
  });

  describe('delete annotation', () => {
    it('should return IAnnotation response', async(() => {
      api.deleteAnnotation(annotation).subscribe((response) => {
        expect(response.body.documentId).toEqual(dmDocumentId);
      });

      const req = httpMock.expectOne(`/em-anno/annotations/${annotation.id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(annotation);
    }));
  });

  describe('save annotation', () => {
    it('should return IAnnotation response', async(() => {
      api.createAnnotation(annotation).subscribe((response) => {
        expect(response.body.documentId).toEqual(annotation.documentId);
      });

      const req = httpMock.expectOne('/em-anno/annotations');
      expect(req.request.method).toBe('POST');
      req.flush(annotation);
    }));
  });
});
