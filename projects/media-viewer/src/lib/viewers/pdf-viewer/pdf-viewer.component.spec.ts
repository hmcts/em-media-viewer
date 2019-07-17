import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { annotationSet } from '../../../assets/annotation-set';
import { PrintService } from '../../print.service';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {ErrorMessageComponent} from '../error-message/error.message.component';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {AnnotationSetComponent} from '../../annotations/annotation-set/annotation-set.component';
import { AnnotationApiService } from '../../annotations/annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { DocumentLoadProgress } from './pdf-js/pdf-js-wrapper';
import { ViewerEventService } from '../viewer-event.service';

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
    pageRendered: new Subject<{pageNumber: number, source: {rotation: number, scale: number, div: Element}}>()
  };

  const mockViewerEvent = {
    onTextSelection: () => {},
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
        {provide: PdfJsWrapperFactory, useValue: mockFactory},
        {provide: ViewerEventService, useValue: mockViewerEvent},
        {provide: PrintService, useFactory: () => mockPrintService},
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AnnotationSetComponent]
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

  it('should initialise and load document', async () => {
    component.url = 'a';
    spyOn(mockPrintService, 'printDocumentNatively');
    spyOn(component, 'onPageLoaded');
    spyOn(mockWrapper, 'loadDocument');
    spyOn(mockWrapper, 'downloadFile');
    spyOn(mockWrapper, 'rotate');
    spyOn(mockWrapper, 'setZoom');
    spyOn(mockWrapper, 'stepZoom');
    spyOn(mockWrapper, 'search');
    spyOn(mockWrapper, 'setPageNumber');
    spyOn(mockWrapper, 'changePageNumber');

    component.ngAfterContentInit();
    toolbarEvent.print.next();
    toolbarEvent.download.next();
    toolbarEvent.rotate.next();
    toolbarEvent.zoom.next();
    toolbarEvent.stepZoom.next();
    toolbarEvent.search.next();
    toolbarEvent.setCurrentPage.next();
    toolbarEvent.changePageByDelta.next();

    expect(mockPrintService.printDocumentNatively).toHaveBeenCalled();
    expect(mockWrapper.downloadFile).toHaveBeenCalled();
    expect(mockWrapper.rotate).toHaveBeenCalled();
    expect(mockWrapper.setZoom).toHaveBeenCalled();
    expect(mockWrapper.stepZoom).toHaveBeenCalled();
    expect(mockWrapper.search).toHaveBeenCalled();
    expect(mockWrapper.setPageNumber).toHaveBeenCalled();
    expect(mockWrapper.changePageNumber).toHaveBeenCalled();
    await expect(mockWrapper.loadDocument).toHaveBeenCalledWith(component.url);
    expect(component.onPageLoaded).toHaveBeenCalled();
  });

  it('should load new document when URL changes', async () => {
    spyOn(mockWrapper, 'loadDocument');
    spyOn(component, 'destroyAnnotationSetComponent');
    spyOn(component, 'onPageLoaded');

    component.url = 'b';
    await component.ngOnChanges({
      url: new SimpleChange('a', component.url, true)
    });

    expect(component.destroyAnnotationSetComponent).toHaveBeenCalled();
    expect(mockWrapper.loadDocument).toHaveBeenCalledWith('b');
    expect(component.onPageLoaded).toHaveBeenCalled();
  });

  it('should store annotationSet components for the pages annotations exist when loaded', () => {
    spyOn(component, 'createAnnotationSetComponent');

    component.onPageLoaded();

    expect(component.pages.length).toEqual(2);
    expect(component.createAnnotationSetComponent).toHaveBeenCalledTimes(2);
  });

  it('should initialise the annotationSet components', async () => {
    const divElement = document.createElement('div');
    const pageRenderEvent = {pageNumber: 1, source: {rotation: 0, scale: 1, div: divElement}};
    const annotationSetComponent = component.createAnnotationSetComponent(pageRenderEvent.pageNumber);
    component.annotationSetComponents.push(annotationSetComponent);
    spyOn(annotationSetComponent.instance, 'initialise');

    await component.onPageRendered(pageRenderEvent);

    expect(component.annotationSetComponents[0].instance.initialise).toHaveBeenCalledWith(pageRenderEvent);
  });

  it('should create annotation set components', () => {
    const annotationSetComponent = component.createAnnotationSetComponent(1);

    expect(annotationSetComponent.instance.page).toEqual(1);
    expect(annotationSetComponent.instance.annotationSet).toEqual({...annotationSet});
  });

  it('should destroy all annotation set component', () => {
    component.annotationSetComponents.push(
      component.createAnnotationSetComponent(1),
      component.createAnnotationSetComponent(2)
    );
    component.pages.push(1, 2);

    component.destroyAnnotationSetComponent();

    expect(component.annotationSetComponents.length).toEqual(0);
    expect(component.pages.length).toEqual(0);
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
    spyOn(component, 'createAnnotationSetComponent');
    spyOn(mockViewerEvent, 'onTextSelection');

    component.onMouseUp(mouseEvent);

    expect(component.pages.length).toEqual(0);
    expect(component.annotationSetComponents.length).toEqual(0);
    expect(component.createAnnotationSetComponent).not.toHaveBeenCalled();
    expect(mockViewerEvent.onTextSelection).not.toHaveBeenCalled();
  });

  it('should create annotation set component for highlight text selected page', () => {
    const page = document.createElement('div');
    spyOn(component.pdfViewer.nativeElement, 'querySelector').and.returnValue(page);
    const mouseEvent = new MouseEvent('mouseup');
    spyOn(toolbarEvent.highlightMode, 'getValue').and.returnValue(true);
    spyOn(mockWrapper, 'getPageNumber').and.callFake(() => {
      return 1;
    });
    spyOn(mockViewerEvent, 'onTextSelection');

    component.onMouseUp(mouseEvent);

    expect(component.pages.length).toEqual(1);
    expect(component.annotationSetComponents.length).toEqual(1);
    setTimeout(() => {
      expect(mockViewerEvent.onTextSelection).toHaveBeenCalled();
    }, 10);
  });
});
