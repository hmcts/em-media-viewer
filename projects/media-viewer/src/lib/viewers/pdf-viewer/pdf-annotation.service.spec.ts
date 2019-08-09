import { inject, TestBed } from '@angular/core/testing';
import { PdfAnnotationService } from './pdf-annotation-service';
import { ComponentFactoryResolver, ElementRef, ViewContainerRef } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewer-event.service';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { annotationSet } from '../../../assets/annotation-set';
import { DocumentLoadProgress, PageEvent, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { Subject } from 'rxjs';
import { DownloadManager, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';

export class MockElementRef extends ElementRef {
  constructor() {
    super(undefined);
  }
}

describe('PdfAnnotationService', () => {
  let pdfService: PdfAnnotationService;
  let factory: ComponentFactoryResolver;
  let toolbarEvent: ToolbarEventService;
  let viewerEventService: ViewerEventService;

  const mockWrapper = {
    loadDocument: () => {},
    search: () => {},
    clearSearch: () => {},
    rotate: () => {},
    setZoom: () => {},
    stepZoom: () => {},
    getZoomValue: () => {},
    downloadFile: () => {},
    setPageNumber: () => {},
    changePageNumber: () => {},
    getPageNumber: () => 1,
    getCurrentPDFZoomValue: () => {},
    getNormalisedPagesRotation: () => 0,
    toolbarEvents: ToolbarEventService,
    pdfViewer: PDFViewer,
    downloadManager: DownloadManager,
    documentLoadInit: new Subject<any>(),
    documentLoadProgress: new Subject<DocumentLoadProgress>(),
    documentLoaded: new Subject<any>(),
    documentLoadFailed: new Subject(),
    pageRendered: new Subject<{pageNumber: number, source: { rotation: number, scale: number, div: Element} }>()
  };

  const mockFactory = {
    create: () => mockWrapper
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PdfAnnotationService,
        ViewContainerRef,
        ToolbarEventService,
        ViewerEventService,
        ComponentFactoryResolver,
        { provide: PdfJsWrapperFactory, useValue: mockFactory },
        { provide: PdfJsWrapper, useValue: mockWrapper },
        { provide: ElementRef, useValue: MockElementRef },
        // { provide: ComponentFactoryResolver, useValue: mockFactoryResolver },
        // { provide: ViewContainerRef, useValue: mockContainerRef },
        // { provide: ToolbarEventService, useValue: toolbarEvent },
        // { provide: ViewerEventService, useValue: viewerEventService }

      ]
    });
  });

  beforeEach(() => {
    pdfService = TestBed.get(PdfAnnotationService);
    factory = TestBed.get(ComponentFactoryResolver);
    toolbarEvent = TestBed.get(ToolbarEventService);
    viewerEventService = TestBed.get(ViewerEventService);

    pdfService.annotationSet = { ...annotationSet };
  });

  it('should be created', inject([PdfAnnotationService], (service: PdfAnnotationService) => {
    expect(service).toBeTruthy();
  }));

  // it('should set the pdf wrapper and pdf viewer', () => {
  //   spyOn(pdfjsWrapperFactory, 'create').and.callThrough();
  //   const pdfjsWrapper = pdfjsWrapperFactory.create(new MockElementRef());
  //   pdfService.init(pdfjsWrapper, new MockElementRef());
  //
  //   expect(pdfService.pdfWrapper).not.toBe(undefined);
  //   expect(pdfService.pdfViewer).not.toBe(undefined);
  // });

  it('should create the annotation set for the pages with annotations', () => {
    spyOn<any>(pdfService, 'createAnnotationSetComponent');
    pdfService.setupAnnotationSet({ ...annotationSet });

    expect(pdfService.pages.length).toEqual(2);
    expect(pdfService.annotationSetComponents.length).toEqual(2);
  });

  it('should create the comment set for the given page', () => {
    spyOn<any>(pdfService, 'createCommentSetComponent');

    const commentSetComponent = pdfService.setupCommentSet(1);

    expect(pdfService.commentSetComponents.length).toEqual(1);
  });

  it('should destroy all references to any sets and pages', () => {
    pdfService.destroy();

    expect(pdfService.commentSetComponents.length).toEqual(0);
    expect(pdfService.annotationSetComponents.length).toEqual(0);
    expect(pdfService.pages).toEqual([]);
  });

  // it('should initialise all the set components for the pdf viewer', () => {
  //   // setup
  //   spyOn<any>(pdfService, 'createAnnotationSetComponent');
  //   spyOn<any>(pdfService, 'createCommentSetComponent');
  //   pdfService.setupAnnotationSet({ ...annotationSet });
  //   pdfService.setupCommentSet(1);
  //   const specificAnnotationSet = pdfService.annotationSetComponents.find((annotation) => annotation.instance.page === 1);
  //
  //   spyOn(specificAnnotationSet.instance, 'initialise').and.callThrough();
  //   const mockRealElement = document.createElement('div');
  //   const mockEventSource: PageEvent = {
  //     pageNumber: 1,
  //     source: {
  //       rotation: 0,
  //       scale: 1,
  //       div: mockRealElement
  //     }
  //   };
  //
  //   pdfService.onPageRendered(mockEventSource);
  //
  //   expect(specificAnnotationSet.instance.initialise).toHaveBeenCalledWith(mockEventSource.source);
  // });

  // it('should call on text selection with the mouse event', () => {
  //   const mouseEvent = new MouseEvent('click');
  //   spyOn(toolbarEvent.highlightMode, 'getValue').and.returnValue(true);
  //   spyOn(mockWrapper, 'getPageNumber');
  //
  //   pdfService.onHighlightSelected(mouseEvent);
  //
  //   expect(toolbarEvent.highlightMode.getValue).toHaveBeenCalled();
  //   setTimeout(() => {
  //     spyOn(viewerEventService, 'onTextSelection').and.callThrough();
  //     expect(viewerEventService.onTextSelection).toHaveBeenCalledWith({ page: 1, event: mouseEvent});
  //   }, 1);
  // });

  // it('should highlight the text on selected page', () => {
  //   const mouseEvent = new MouseEvent('click');
  //   spyOn(pdfService, 'onHighlightSelected').and.callThrough();
  //   spyOn(toolbarEvent.highlightMode, 'getValue').and.returnValue(true);
  //   pdfService.onHighlightSelected(mouseEvent);
  //
  //   expect(pdfService.onHighlightSelected).toHaveBeenCalled();
  // });
});
