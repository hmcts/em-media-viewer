import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

import { PdfViewerComponent } from './pdf-viewer.component';

import { AnnotationStoreService } from '../../annotation/annotation-store.service';
import { AnnotationApiHttpService } from '../../annotation/annotation-api-http.service';
import { CommentsComponent } from '../../annotation/comments/comments.component';
import { EmLoggerService } from '../../../logging/em-logger.service';

class MockPdfService {
  pageNumber: Subject<number>;

  preRun() {
    this.pageNumber = new Subject();
    this.pageNumber.next(1);
  }

}

class MockAnnotationStoreService {
  preLoad() {}
  setCommentBtnSubject(commentId: string) {}
  setAnnotationFocusSubject() {}
  getAnnotationFocusSubject() {}
}



class MockApiHttpService {
  getBaseUrl() {}
  setBaseUrl(baseUrl) {}
}

class MockUtils {
  clickIsHighlight() {}
  getClickedPage() {}
}

class MockViewerComponent {
  nativeElement: { querySelector() };
}

class MockPdfRenderService {

  listPagesSubject = new Subject();

  setRenderOptions() {}
  getRenderOptions() {}
  getDataLoadedSub() {}
  render() {}
  getPdfPages() {}
}

class MockRotationFactoryService {
}

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  const mockPdfRenderService = new MockPdfRenderService();
  const mockAnnotationStoreService = new MockAnnotationStoreService();
  const mockPdfService = new MockPdfService();
  const mockApiHttpService = new MockApiHttpService();
  const mockUtils = new MockUtils();
  const mockViewerComponent = new MockViewerComponent();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfViewerComponent, CommentsComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EmLoggerService,
        { provide: AnnotationStoreService, useFactory: () => mockAnnotationStoreService },
        { provide: AnnotationApiHttpService, useFactory: () => mockApiHttpService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
