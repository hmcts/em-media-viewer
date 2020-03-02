import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { AnnotationApiService } from './annotation-api.service';
import { AnnotationSet } from './annotation-set/annotation-set.model';
import { User } from './models/user.model';
import { Annotation } from './annotation-set/annotation-view/annotation.model';
import { of } from 'rxjs';
import { Comment } from './comment-set/comment/comment.model';

describe('AnnotationApiService', () => {
  let httpMock: HttpTestingController;
  let api: AnnotationApiService;
  const dmDocumentId = 'ad88d12c-8526-49b6-ae5e-3f7ea5d08168';
  const annotationSetId = 'ae2133a4-8dc5-430b-bb20-5290bd801f94';
  const annotationId = 'f6225689-29ab-4e0d-9bea-8519a06d16f9';
  const user: User = {
    email: 'example@example.org',
    forename: 'Forename',
    surname: 'Surname'
  };

  const comments: Comment[] = [
    {
      id: '1',
      annotationId: annotationId,
      createdBy: 'example@example.org',
      createdByDetails: user,
      createdDate: '2019-06-03T10:00:00Z',
      lastModifiedBy: 'example@example.org',
      lastModifiedByDetails: user,
      lastModifiedDate: '2019-06-03T10:00:00Z',
      content: 'Test comment 1',
      tags: []
    },
    {
      id: '2',
      annotationId: annotationId,
      createdBy: 'example@example.org',
      createdByDetails: user,
      createdDate: '2019-06-03T10:00:00Z',
      lastModifiedBy: 'example@example.org',
      lastModifiedByDetails: user,
      lastModifiedDate: '2019-06-03T10:00:00Z',
      content: 'Test comment 2',
      tags: []
    },
    {
      id: '3',
      annotationId: annotationId,
      createdBy: 'example@example.org',
      createdByDetails: user,
      createdDate: '2019-06-03T10:00:00Z',
      lastModifiedBy: 'example@example.org',
      lastModifiedByDetails: user,
      lastModifiedDate: '2019-06-03T10:00:00Z',
      content: 'Test comment 3',
      tags: []
    },
  ];

  const annotation: Annotation = {
    id: annotationId,
    annotationSetId: annotationSetId,
    createdBy: 'example@example.org',
    createdByDetails: user,
    createdDate: '2019-06-03T10:00:00Z',
    lastModifiedBy: 'example@example.org',
    lastModifiedByDetails: user,
    lastModifiedDate: '2019-06-03T10:00:00Z',
    page: 1,
    color: 'FFFF00',
    type: 'highlight',
    comments: comments,
    rectangles: [],
    tags: []
  };

  const annotationSet: AnnotationSet = {
    id: annotationSetId,
    createdBy: 'example@example.org',
    createdByDetails: user,
    createdDate: '2019-06-03T10:00:00Z',
    lastModifiedBy: 'example@example.org',
    lastModifiedByDetails: user,
    lastModifiedDate: '2019-06-03T10:00:00Z',
    documentId: dmDocumentId,
    annotations: [annotation]
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
    api.annotationApiUrl = '/my-context-path';
    httpMock = TestBed.get(HttpTestingController);
  });


  it('should be created', inject([AnnotationApiService], (service: AnnotationApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should createAnnotationSet', fakeAsync((done) => {
    const requestBody = {
      documentId: dmDocumentId,
      id: '6d1f5e09-98ad-4891-aecc-936282b06148'
    };
    api.postAnnotationSet(requestBody).subscribe((response) => {
      expect(response.documentId).toEqual(dmDocumentId);
    }, error => done(error));

    const req = httpMock.expectOne('/my-context-path/annotation-sets');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.documentId).toBe(dmDocumentId);
    expect(req.request.body.id).toBeTruthy();
    req.flush(annotationSet);
  }));

  it('get annotation set', fakeAsync((done) => {
    const docUrl = `/doc-store-host/documents/${dmDocumentId}`;
    api.getAnnotationSet(docUrl)
      .subscribe((response) => {
        expect(response.documentId).toBe(dmDocumentId);
        }, error => done(error));

    const req = httpMock.expectOne(`/my-context-path/annotation-sets/filter?documentId=${dmDocumentId}`);
    expect(req.request.method).toBe('GET');
    req.flush(annotationSet);
  }));

  it('delete annotation', fakeAsync((done) => {
    api.deleteAnnotation(annotation.id).subscribe((response) => {
      expect(response).toEqual(null);
    }, error => done(error));

    const req = httpMock.expectOne(`/my-context-path/annotations/${annotation.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  }));

  it('save annotation', fakeAsync((done) => {
    api.postAnnotation(annotation).subscribe((response) => {
      expect(response.annotationSetId).toEqual(annotationSet.id);
    }, error => done(error));

    const req = httpMock.expectOne('/my-context-path/annotations');
    expect(req.request.method).toBe('POST');
    req.flush(annotation);
  }));

  it('get comments', fakeAsync((done) => {
    const annotationSetObservable = of(annotationSet);
    api.getComments(annotationSetObservable).subscribe((comment) => {
      expect(comment[0].content).toBe('Test comment 1');
      expect(comment[1].content).toBe('Test comment 2');
      expect(comment[2].content).toBe('Test comment 3');
    }, error => done(error));
  }));


  it('gets an annotation set or creates it if it does not exist', fakeAsync((done) => {
    api.getOrCreateAnnotationSet(dmDocumentId).subscribe((response) => {
      expect(response.documentId).toBe(dmDocumentId);
    }, error => done(error));

    const req1 = httpMock.expectOne(`/my-context-path/annotation-sets/filter?documentId=${dmDocumentId}`);
    expect(req1.request.method).toBe('GET');
    req1.error(new ErrorEvent('Not found'), { status: 404 });

    const req2 = httpMock.expectOne('/my-context-path/annotation-sets');
    expect(req2.request.method).toBe('POST');
    expect(req2.request.body.documentId).toBe(dmDocumentId);
    expect(req2.request.body.id).toBeTruthy();

    req2.flush(annotationSet);
  }));
});
