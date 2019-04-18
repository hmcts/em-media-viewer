import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';

import { PdfViewerComponent } from './pdf-viewer.component';
import { AnnotationSet, Annotation } from '../../data/annotation-set.model';

import { PdfService } from '../../data/pdf.service';
import { AnnotationStoreService } from '../../data/annotation-store.service';
import { NpaService } from '../../data/npa.service';
import { ApiHttpService } from '../../data/api-http.service';
import { Utils } from '../../data/utils';
import { PdfAnnotateWrapper } from '../../data/js-wrapper/pdf-annotate-wrapper';
import { CommentsComponent } from './comments/comments.component';
import { EmLoggerService } from '../../logging/em-logger.service';
import { PdfRenderService } from '../../data/pdf-render.service';
import { RotationFactoryService } from './rotation-toolbar/rotation-factory.service';
import { RenderOptions } from '../../data/js-wrapper/renderOptions.model';

class MockPdfAnnotateWrapper {
  setStoreAdapter() {}
  getStoreAdapter() {}
}

class MockPdfService {
  pageNumber: Subject<number>;

  preRun() {
    this.pageNumber = new Subject();
    this.pageNumber.next(1);
  }

  setHighlightTool() {}
  setPageNumber(page: number) {}
  getPageNumber() {
    return this.pageNumber;
  }
  setAnnotationWrapper() {}
}

class MockAnnotationStoreService {
  preLoad() {}
  setCommentBtnSubject(commentId: string) {}
  setAnnotationFocusSubject() {}
  getAnnotationFocusSubject() {}
  setCommentFocusSubject() {}
  setToolBarUpdate() {}
  getAnnotationsForPage() {}
}

class MockNpaService {
  outputDmDocumentId: Subject<string>;

  constructor() {
    this.outputDmDocumentId = new Subject<string>();
  }

  setPageNumber(pageNumber: number) {}
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
  const mockRotationFactoryService = new MockRotationFactoryService();
  const mockAnnotationStoreService = new MockAnnotationStoreService();
  const mockPdfService = new MockPdfService();
  const mockNpaService = new MockNpaService();
  const mockApiHttpService = new MockApiHttpService();
  const mockUtils = new MockUtils();
  const mockPdfAnnotateWrapper = new MockPdfAnnotateWrapper();
  const mockViewerComponent = new MockViewerComponent();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfViewerComponent, CommentsComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EmLoggerService,
        { provide: Utils, useFactory: () => mockUtils },
        { provide: PdfService, useFactory: () => mockPdfService },
        { provide: AnnotationStoreService, useFactory: () => mockAnnotationStoreService },
        { provide: NpaService, useFactory: () => mockNpaService },
        { provide: PdfAnnotateWrapper, useFactory: () => mockPdfAnnotateWrapper },
        { provide: ApiHttpService, useFactory: () => mockApiHttpService },
        { provide: PdfRenderService, useFactory: () => mockPdfRenderService },
        { provide: RotationFactoryService, useFactory: () => mockRotationFactoryService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;

    component.annotate = true;
    component.dmDocumentId = '116b0b0f-65da-41e3-9852-648fe4c30409';
    component.outputDmDocumentId = '116b0b0f-65da-41e3-9852-648fe4c30409';
    component.url = '';
    component.annotationSet = new AnnotationSet(
      '606fadd5-655b-4675-aa9a-df65f86fb37c',
    '125334', null,
    new Date(), null, null,
    null, '116b0b0f-65da-41e3-9852-648fe4c30409', []);

    component.baseUrl = 'localhost:3000';
    spyOn(component, 'ngAfterViewInit').and.stub();

    const mockNativeElement = { querySelector() {} };
    spyOn(mockNativeElement, 'querySelector').and.callFake(function() {
      const dummyElement = document.createElement('div');
      return dummyElement;
    });
    mockViewerComponent.nativeElement = mockNativeElement;
    component.viewerElementRef = mockViewerComponent;
    spyOn(mockAnnotationStoreService, 'getAnnotationFocusSubject')
      .and.returnValue(of(new Annotation));

    spyOn(mockPdfRenderService, 'getDataLoadedSub').and.returnValue(of(true));
    fixture.detectChanges();
    const mockCommentsComponent = fixture.componentInstance.commentsComponent;
    spyOn(mockCommentsComponent, 'handleAnnotationBlur').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should run tasks', async(() => {
      spyOn(mockPdfService, 'preRun');
      spyOn(mockPdfRenderService, 'render');
      spyOn(mockPdfRenderService, 'setRenderOptions');
      spyOn(mockPdfService, 'getPageNumber').and.returnValue(of(1));

      component.ngOnInit();
      const renderOptions = new RenderOptions(component.url,
        null,
        parseFloat('1.33'),
        0, []);

      expect(mockPdfRenderService.setRenderOptions)
        .toHaveBeenCalledWith(renderOptions);
      expect(mockPdfService.preRun).toHaveBeenCalledTimes(1);
      expect(mockPdfRenderService.render).toHaveBeenCalledTimes(1);
      expect(mockAnnotationStoreService.getAnnotationFocusSubject).toHaveBeenCalled();
      expect(component['page']).toBe(1);
    }));
  });

  describe('onDestroy', () => {
    it('should unsubscribe from pageNumberSubscription', () => {
      spyOn(component['pageNumberSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['pageNumberSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('should unsubscribe from focusedAnnotationSubscription', () => {
      spyOn(component['focusedAnnotationSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['focusedAnnotationSubscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('loadAnnotations', () => {
    it('calls annotation services when annotate true', async(() => {
      spyOn(mockAnnotationStoreService, 'preLoad');
      spyOn(mockApiHttpService, 'setBaseUrl');

      component.loadAnnotations(true);
      expect(mockApiHttpService.setBaseUrl).toHaveBeenCalled();
      expect(mockAnnotationStoreService.preLoad).toHaveBeenCalledTimes(1);
    }));

    it('calls preload with null when annotate false', async(() => {
      spyOn(mockAnnotationStoreService, 'preLoad').and.callFake(function() {
        expect(arguments[0]).toBeNull();
      });
      component.loadAnnotations(false);
    }));
  });

  describe('focusHighlightStyle', () => {
    it('should add comment-selected class to focused annotation', () => {
      component.focusHighlightStyle(new Annotation('dummyId'));
    });
  });

  describe('unfocusAnnotation', () => {
    it('should update the setAnnotationFocusSubject with empty annotation', () => {
      spyOn(mockAnnotationStoreService, 'setAnnotationFocusSubject').and
        .callFake((passedAnnotation: Annotation) => {
          expect(passedAnnotation.id).toBeUndefined();
        });
      component.unfocusAnnotation();
    });

    it('should update the commentBtnSubject with null', () => {
      spyOn(mockAnnotationStoreService, 'setCommentBtnSubject');
      component.unfocusAnnotation();
      expect(mockAnnotationStoreService.setCommentBtnSubject).toHaveBeenCalledWith(null);
    });

    it('should update the setCommentFocusSubject with empty annotation', () => {
      spyOn(mockAnnotationStoreService, 'setCommentFocusSubject').and
        .callFake((passedAnnotation: Annotation) => {
          expect(passedAnnotation.id).toBeUndefined();
        });
      component.unfocusAnnotation();
    });
  });

  describe('handleClick', () => {
    it('should call unfocusAnnotation when clickIsHighlight returns false', () => {
      const dom = document.createElement('div');
      const parentNode = document.createElement('div');
      parentNode.setAttribute('data-page-number', '1');
      spyOnProperty(dom, 'parentNode', 'get').and.returnValue(parentNode);
      const event = {target: dom};
      spyOn(mockUtils, 'clickIsHighlight').and.returnValue(false);
      spyOn(component, 'unfocusAnnotation').and.stub();

      component.handleClick(event);
      expect(component.unfocusAnnotation).toHaveBeenCalled();
    });

    it('should call pdfService setpagenumber and utils getclickedpage', () => {
      const dom = document.createElement('div');
      const parentNode = document.createElement('div');
      parentNode.setAttribute('data-page-number', '1');
      spyOnProperty(dom, 'parentNode', 'get').and.returnValue(parentNode);
      const event = {target: dom};

      spyOn(mockPdfService, 'setPageNumber');
      spyOn(mockUtils, 'clickIsHighlight').and.returnValue(true);

      component.handleClick(event, false);
      expect(mockPdfService.setPageNumber).not.toHaveBeenCalled();
    });

    it('should only set the pageNumberSubject if isPage is true', () => {
      const dom = document.createElement('div');
      const parentNode = document.createElement('div');
      parentNode.setAttribute('data-page-number', '1');
      spyOnProperty(dom, 'parentNode', 'get').and.returnValue(parentNode);
      const event = {target: dom};

      spyOn(mockPdfService, 'setPageNumber');
      spyOn(mockUtils, 'clickIsHighlight').and.returnValue(true);
      spyOn(mockUtils, 'getClickedPage').and.returnValue(1);

      component.handleClick(event, true);
      expect(mockUtils.getClickedPage).toHaveBeenCalled();
      expect(mockPdfService.setPageNumber).toHaveBeenCalledWith(1);
    });
  });
});
