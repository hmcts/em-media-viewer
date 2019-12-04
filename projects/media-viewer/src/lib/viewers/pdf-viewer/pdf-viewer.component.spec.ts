import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
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
import { ViewerException } from '../error-message/viewer-exception.model';
import { AnnotationService } from '../../annotations/annotation.service';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;
  let toolbarEvent: ToolbarEventService;
  let viewerEvent: ViewerEventService;
  let annotationsDestroyed: boolean;

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
    getCurrentPDFTitle: () => {},
    documentLoadInit: new Subject<any>(),
    documentLoadProgress: new Subject<DocumentLoadProgress>(),
    documentLoaded: new Subject<any>(),
    documentLoadFailed: new Subject(),
    pageRendered: new Subject<{pageNumber: number, source: { rotation: number, scale: number, div: Element} }>()
  };

  const mockViewerEvent = {
    onTextSelection: () => {},
    toggleCommentsPanel: () => {},
    commentsPanelToggle: new BehaviorSubject(true)
  };

  const mockAnnotationService = {
    init: () => {},
    setupAnnotationSet: () => {},
    onShapeHighlighted: () => {},
    onTextHighlighted: () => {},
    destroyComponents: () => {
      annotationsDestroyed = true;
    }
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
        AnnotationService,
        AnnotationApiService,
        ToolbarEventService,
        { provide: PdfJsWrapperFactory, useValue: mockFactory },
        { provide: ViewerEventService, useValue: mockViewerEvent },
        { provide: PrintService, useFactory: () => mockPrintService }
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

  it('should addToDOM and load document', () => {
    component.url = 'a';
    spyOn(mockPrintService, 'printDocumentNatively');
    spyOn(mockAnnotationService, 'setupAnnotationSet');
    spyOn(mockWrapper, 'loadDocument');
    spyOn(mockWrapper, 'downloadFile');
    spyOn(mockWrapper, 'rotate');
    spyOn(mockWrapper, 'setZoom');
    spyOn(mockWrapper, 'stepZoom');
    spyOn(mockWrapper, 'search');
    spyOn(mockWrapper, 'setPageNumber');
    spyOn(mockWrapper, 'changePageNumber');
    spyOn(mockViewerEvent, 'toggleCommentsPanel');

    component.ngAfterContentInit();
    toolbarEvent.printSubject.next();
    toolbarEvent.downloadSubject.next();
    toolbarEvent.rotateSubject.next();
    toolbarEvent.zoomSubject.next();
    toolbarEvent.stepZoomSubject.next();
    toolbarEvent.searchSubject.next();
    toolbarEvent.setCurrentPageSubject.next();
    toolbarEvent.changePageByDeltaSubject.next();

    expect(mockPrintService.printDocumentNatively).toHaveBeenCalled();
    expect(mockWrapper.downloadFile).toHaveBeenCalled();
    expect(mockWrapper.rotate).toHaveBeenCalled();
    expect(mockWrapper.setZoom).toHaveBeenCalled();
    expect(mockWrapper.stepZoom).toHaveBeenCalled();
    expect(mockWrapper.search).toHaveBeenCalled();
    expect(mockWrapper.setPageNumber).toHaveBeenCalled();
    expect(mockWrapper.changePageNumber).toHaveBeenCalled();
    expect(mockWrapper.loadDocument).toHaveBeenCalledWith(component.url);
  });

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
    mockWrapper.documentLoadFailed.next((error) => {
      throw new ViewerException(error);
    });
    expect(component.errorMessage).toContain('Could not load the document');
    expect(component.loadingDocument).toBe(false);
  });

  it('should call the print operation', async () => {
    spyOn(mockPrintService, 'printDocumentNatively');
    component.url = 'derp';
    toolbarEvent.printSubject.next();
    expect(mockPrintService.printDocumentNatively).toHaveBeenCalledWith(component.url);
  });

  it('clear the search when the search bar is closed', () => {
    spyOn(mockWrapper, 'clearSearch');
    component.searchBarHidden = true;
    expect(mockWrapper.clearSearch).toHaveBeenCalled();
  });

  it('should not highlight text when in view mode for selected page', () => {
    const mouseEvent = new MouseEvent('mouseup');
    spyOn(toolbarEvent.highlightModeSubject, 'getValue').and.returnValue(false);
    spyOn(mockAnnotationService, 'onTextHighlighted');
    spyOn(mockViewerEvent, 'onTextSelection');

    component.onMouseUp(mouseEvent);

    expect(mockAnnotationService.onTextHighlighted).not.toHaveBeenCalled();
    expect(mockViewerEvent.onTextSelection).not.toHaveBeenCalled();
  });

  it('should select the page', () => {
    const mouseEvent = new MouseEvent('mousedown');
    spyOn(mockAnnotationService, 'onShapeHighlighted');
    component.onMouseDown(mouseEvent);
    expect(mockAnnotationService.onShapeHighlighted).not.toHaveBeenCalled();
  });

  it('should initialize loading of document', () => {
    mockWrapper.documentLoadInit.next();
    expect(component.loadingDocument).toBe(true);
    expect(component.loadingDocumentProgress).toBe(null);
    expect(component.errorMessage).toBe(null);
  });

  it('should change status of loading document to false after document has been loaded', () => {
    component.loadingDocument = true;
    mockWrapper.documentLoaded.next();
    expect(component.loadingDocument).toBe(false);
  });

  it('should load new document when URL changes', async () => {
    component.enableAnnotations = true;
    const spyComponentLoadDocument = spyOn<any>(component, 'loadDocument');

    component.url = 'b';
    await component.ngOnChanges({
      url: new SimpleChange('a', component.url, true)
    });

    expect(spyComponentLoadDocument).toHaveBeenCalled();
  });

  it('should emit documentTitle when document is loaded', async () => {
    const documentTitleSpy = spyOn(component.documentTitle, 'emit');
    component.url = 'b';
    await component.ngOnChanges({
      url: new SimpleChange('a', component.url, true)
    });

    expect(documentTitleSpy).toHaveBeenCalled();
  });

  it('should load new document when annotations enabled', async () => {
    annotationsDestroyed = false;
    component.enableAnnotations = true;
    const spyComponentLoadDocument = spyOn<any>(component, 'loadDocument');
    spyOn<any>(mockAnnotationService, 'destroyComponents');

    await component.ngOnChanges({
      enableAnnotations: new SimpleChange(false, true, false)
    });

    expect(spyComponentLoadDocument).toHaveBeenCalled();
    expect(annotationsDestroyed).toBeFalsy();
  });

  it('should load document and destroy annotations when annotations disabled', async () => {
    annotationsDestroyed = false;
    component.enableAnnotations = false;
    const spyComponentLoadDocument = spyOn<any>(component, 'loadDocument');

    await component.ngOnChanges({
      enableAnnotations: new SimpleChange(true, false, false)
    });
    fixture.detectChanges();

    expect(spyComponentLoadDocument).toHaveBeenCalled();
    expect(annotationsDestroyed).toBeTruthy();
    expect(component.annotationSet).toBeNull();
  });

  it('should show comments panel', () => {
    component.showCommentsPanel = false;

    mockViewerEvent.commentsPanelToggle.next(true);
    fixture.detectChanges();

    expect(component.showCommentsPanel).toBeTruthy();
    expect(component.viewerContainer.nativeElement.classList).toContain('show-comments-panel');
  });

  it('should hide comments panel', () => {
    component.showCommentsPanel = true;

    mockViewerEvent.commentsPanelToggle.next(false);
    fixture.detectChanges();

    expect(component.showCommentsPanel).toBeFalsy();
    expect(component.viewerContainer.nativeElement.classList).not.toContain('show-comments-panel');
  });
});
