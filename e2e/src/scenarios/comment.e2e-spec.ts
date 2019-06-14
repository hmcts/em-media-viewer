import { CommentPage } from '../pages/comment.po';
// import { AnnotationApiService } from 'projects/media-viewer/src/lib/annotations/annotation-api.service';
import { AnnotationApiService } from '../../../projects/media-viewer/src/lib/annotations/annotation-api.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { browser, by, element } from 'protractor';


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
    spyOn(annotationApiService, 'getAnnotationSet').and.callFake(page.getMockAnnotationSet);
  });

  beforeEach(async () => {
    page = new CommentPage();
    await page.preparePage();
  });


  // objective: Set up data mocking within here.
  it('should show test-data', async () => {
    page.openModal();
    browser.sleep(10000);
  });
});
