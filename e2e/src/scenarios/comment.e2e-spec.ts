import { CommentPage } from '../pages/comment.po';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnnotationApiService } from 'projects/media-viewer/src/lib/annotations/annotation-api.service';
import { HttpResponse } from '@angular/common/http';
import dummyAnnotationSet from 'projects/media-viewer/src/assets/annotation-set.json';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnnotationSet } from 'projects/media-viewer/src/lib/annotations/annotation-set.model';

describe('search', () => {
  let page: CommentPage;
  let annotationApiService: AnnotationApiService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        AnnotationApiService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    annotationApiService = TestBed.get(AnnotationApiService);
  });

  beforeEach(async () => {
    page = new CommentPage();
    await page.preparePage();
  });


  // objective: Set up data mocking within here.
  it('should show test-data', async () => {
    spyOn(annotationApiService, 'getAnnotationSet').and.callFake(page.getMockAnnotationSet(annotationApiService)); // TODO Start here
  });
});
