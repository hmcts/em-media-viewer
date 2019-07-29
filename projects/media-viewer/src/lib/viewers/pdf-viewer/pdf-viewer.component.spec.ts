import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { annotationSet } from '../../../assets/annotation-set';
import { PrintService } from '../../print.service';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ErrorMessageComponent } from '../error-message/error.message.component';
import { By } from '@angular/platform-browser';
import { AnnotationSetComponent } from '../../annotations/annotation-set/annotation-set.component';
import { AnnotationApiService } from '../../annotations/annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { DocumentLoadProgress } from './pdf-js/pdf-js-wrapper';
import { ViewerEventService } from '../viewer-event.service';
import { PdfAnnotationService } from './pdf-annotation-service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;
  let toolbarEvent: ToolbarEventService;
  let viewerEvent: ViewerEventService;

  const mockWrapper = {
    loadDocument: () => {},
    search: () => {},
    clearSearch: () => {},
    rotate: () => {},
    setZoom: () => {},
    stepZoom: () => {},
    downloadFile: () => {},
    setPageNumber: () => {},
    changePageNumber: () => {},
    getPageNumber: () => {},
    getCurrentPDFZoomValue: () => {},
    getNormalisedPagesRotation: () => 0,
    documentLoadInit: new Subject<string>(),
    documentLoadProgress: new Subject<DocumentLoadProgress>(),
    documentLoaded: new Subject<any>(),
    documentLoadFailed: new Subject(),
    pageRendered: new Subject<{pageNumber: number, source: { rotation: number, scale: number, div: Element} }>()
  };

  const mockViewerEvent = {
    onTextSelection: () => {},
  };

  const mockAnnotationService = {
    init: () => {},
    setupAnnotationSet: () => {},
    onPageSelected: () => {},
    onHighlightSelected: () => {},
  };

  const mockFactory = {
    create: () => mockWrapper
  };

  const mockPrintService = {
    printDocumentNatively: () => {}
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PdfViewerComponent, ErrorMessageComponent, AnnotationSetComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AnnotationApiService,
        ToolbarEventService,
        { provide: PdfJsWrapperFactory, useValue: mockFactory },
        { provide: ViewerEventService, useValue: mockViewerEvent },
        { provide: PrintService, useFactory: () => mockPrintService },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
      .overrideComponent(PdfViewerComponent, {
        set: {
          providers: [{ provide: PdfAnnotationService, useValue: mockAnnotationService }]
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerComponent);
    toolbarEvent = TestBed.get(ToolbarEventService);
    viewerEvent = TestBed.get(ViewerEventService);
    component = fixture.componentInstance;
    component.annotationSet = { ...annotationSet };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  // it('should initialise and load document', async () => {
  //   component.url = 'a';
  //   spyOn(mockPrintService, 'printDocumentNatively');
  //   spyOn(mockAnnotationService, 'setupAnnotationSet');
  //   spyOn(mockWrapper, 'loadDocument');
  //   spyOn(mockWrapper, 'downloadFile');
  //   spyOn(mockWrapper, 'rotate');
  //   spyOn(mockWrapper, 'setZoom');
  //   spyOn(mockWrapper, 'stepZoom');
  //   spyOn(mockWrapper, 'search');
  //   spyOn(mockWrapper, 'setPageNumber');
  //   spyOn(mockWrapper, 'changePageNumber');

  //   await component.ngAfterContentInit();
  //   toolbarEvent.print.next();
  //   toolbarEvent.download.next();
  //   toolbarEvent.rotate.next();
  //   toolbarEvent.zoom.next();
  //   toolbarEvent.stepZoom.next();
  //   toolbarEvent.search.next();
  //   toolbarEvent.setCurrentPage.next();
  //   toolbarEvent.changePageByDelta.next();

  //   expect(mockPrintService.printDocumentNatively).toHaveBeenCalled();
  //   expect(mockWrapper.downloadFile).toHaveBeenCalled();
  //   expect(mockWrapper.rotate).toHaveBeenCalled();
  //   expect(mockWrapper.setZoom).toHaveBeenCalled();
  //   expect(mockWrapper.stepZoom).toHaveBeenCalled();
  //   expect(mockWrapper.search).toHaveBeenCalled();
  //   expect(mockWrapper.setPageNumber).toHaveBeenCalled();
  //   expect(mockWrapper.changePageNumber).toHaveBeenCalled();
  //   await expect(mockWrapper.loadDocument).toHaveBeenCalledWith(component.url);
  //   expect(mockAnnotationService.setupAnnotationSet).toHaveBeenCalled();
  // });

  // it('should load new document when URL changes', async () => {
  //   component.enableAnnotations = true;
  //   spyOn(mockWrapper, 'loadDocument');
  //   spyOn(mockAnnotationService, 'setupAnnotationSet');

  //   component.url = 'b';
  //   await component.ngOnChanges({
  //     url: new SimpleChange('a', component.url, true)
  //   });

  //   expect(mockWrapper.loadDocument).toHaveBeenCalledWith('b');
  //   expect(mockAnnotationService.setupAnnotationSet).toHaveBeenCalled();
  // });

  it('on DocumentLoadProgress indicate document loading progress', () => {
    mockWrapper.documentLoadProgress.next({ loaded: 10, total: 100 });
    expect(component.loadingDocumentProgress).toBe(10);
    mockWrapper.documentLoadProgress.next({ loaded: 90, total: 100 });
    expect(component.loadingDocumentProgress).toBe(90);
    mockWrapper.documentLoadProgress.next({ loaded: 200, total: 100 });
    expect(component.loadingDocumentProgress).toBe(100);
  });

  it('when errorMessage available show error message', () => {
    expect(fixture.debugElement.query(By.css('.pdfContainer')).nativeElement.className).not.toContain('hidden');
    expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBeNull();
    component.errorMessage = 'errorx';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pdfContainer')).nativeElement.className).toContain('hidden');
    expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBeTruthy();
  });

  it('on document load failed expect error message', () => {
    mockWrapper.documentLoadFailed.next();
    expect(component.errorMessage).toContain('Could not load the document');
    expect(component.loadingDocument).toBe(false);
  });

  it('should call the print operation', async () => {
    spyOn(mockPrintService, 'printDocumentNatively');
    component.url = 'derp';
    toolbarEvent.print.next();
    expect(mockPrintService.printDocumentNatively).toHaveBeenCalledWith(component.url);
  });

  it('clear the search when the search bar is closed', () => {
    spyOn(mockWrapper, 'clearSearch');
    component.searchBarHidden = true;
    expect(mockWrapper.clearSearch).toHaveBeenCalled();
  });

  it('should not highlight text when in view mode for selected page', () => {
    const mouseEvent = new MouseEvent('mouseup');
    spyOn(toolbarEvent.highlightMode, 'getValue').and.returnValue(false);
    spyOn(mockAnnotationService, 'onHighlightSelected');
    spyOn(mockViewerEvent, 'onTextSelection');

    component.onMouseUp(mouseEvent);

    expect(mockAnnotationService.onHighlightSelected).not.toHaveBeenCalled();
    expect(mockViewerEvent.onTextSelection).not.toHaveBeenCalled();
  });

//   it('should create annotation set component for highlight text selected page', () => {
//     const mouseEvent = new MouseEvent('mouseup');
//     spyOn(mockAnnotationService, 'onHighlightSelected');

//     component.onMouseUp(mouseEvent);

//     expect(mockAnnotationService.onHighlightSelected).toHaveBeenCalled();
//   });
});
