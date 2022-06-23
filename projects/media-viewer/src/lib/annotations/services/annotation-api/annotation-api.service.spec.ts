import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AnnotationApiService } from './annotation-api.service';
import { AnnotationSet } from '../../annotation-set/annotation-set.model';
import { User } from '../../models/user.model';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import { Comment } from '../../comment-set/comment/comment.model';

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
      page: 1,
      pageHeight: 1122,
      selected: false,
      editable: false,
      tags: [],
      pages: []
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
      page: 1,
      pageHeight: 1122,
      selected: false,
      editable: false,
      tags: [],
      pages: []
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
      page: 1,
      pageHeight: 1122,
      selected: false,
      editable: false,
      tags: [],
      pages: []
    },
  ];

  const annotation1: Annotation = {
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
    rectangles: [{
      annotationId,
      x: 100,
      y: 100,
      width: 150,
      height: 50,
      id: null,
      createdBy: null,
      createdDate: null,
      createdByDetails: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      lastModifiedByDetails: null
    }],
    tags: []
  };

  const annotation2: Annotation = {
    id: '2',
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
    rectangles: [{
      annotationId,
      x: 100,
      y: 120,
      width: 150,
      height: 50,
      id: null,
      createdBy: null,
      createdDate: null,
      createdByDetails: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      lastModifiedByDetails: null
    }],
    tags: []
  };

  const annotation3: Annotation = {
    id: '3',
    annotationSetId: annotationSetId,
    createdBy: 'example@example.org',
    createdByDetails: user,
    createdDate: '2019-06-03T10:00:00Z',
    lastModifiedBy: 'example@example.org',
    lastModifiedByDetails: user,
    lastModifiedDate: '2019-06-03T10:00:00Z',
    page: 2,
    color: 'FFFF00',
    type: 'highlight',
    comments: [],
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
    annotations: [annotation1, annotation2, annotation3]
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

    api = TestBed.inject(AnnotationApiService);
    api.annotationApiUrl = '/my-context-path';
    httpMock = TestBed.inject(HttpTestingController);
  });

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
    api.getAnnotationSet(dmDocumentId)
      .subscribe((response) => {
        expect(response.body.documentId).toBe(dmDocumentId);
        }, error => done(error));

    const req = httpMock.expectOne(`/my-context-path/annotation-sets/filter?documentId=${dmDocumentId}`);
    expect(req.request.method).toBe('GET');
    req.flush(annotationSet);
  }));

  it('delete annotation', fakeAsync((done) => {
    api.deleteAnnotation(annotation1.id).subscribe((response) => {
      expect(response).toEqual(null);
    }, error => done(error));

    const req = httpMock.expectOne(`/my-context-path/annotations/${annotation1.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  }));

  it('save annotation', fakeAsync((done) => {
    api.postAnnotation(annotation1).subscribe((response) => {
      expect(response.annotationSetId).toEqual(annotationSet.id);
    }, error => done(error));

    const req = httpMock.expectOne('/my-context-path/annotations');
    expect(req.request.method).toBe('POST');
    req.flush(annotation1);
  }));

  it('get comments', async (done) => {
    const annotationSetObservable = of(annotationSet);
    api.getComments(annotationSetObservable).subscribe((comment) => {
      expect(comment[0].content).toBe('Test comment 1');
      expect(comment[1].content).toBe('Test comment 2');
      expect(comment[2].content).toBe('Test comment 3');
      done();
    });
  });
});
