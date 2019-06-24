import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import {
  ChangePageByDeltaOperation, DocumentLoaded, DocumentLoadFailed, DocumentLoadProgress,
  DownloadOperation, NewDocumentLoadInit,
  PrintOperation,
  RotateOperation,
  SearchOperation,
  SearchResultsCount,
  SetCurrentPageOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../events/viewer-operations';
import { PrintService } from '../../print.service';
import {ComponentFactory, ComponentFactoryResolver, SimpleChange, ViewContainerRef} from '@angular/core';
import {ErrorMessageComponent} from '../error-message/error.message.component';
import {By} from '@angular/platform-browser';
import { annotationSet } from '../../../assets/annotation-set';
import {AnnotationsComponent} from '../../annotations/annotations.component';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;
  let annotationFactory: ComponentFactory<AnnotationsComponent>;
  let viewContainerRef: ViewContainerRef;

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
    currentPageChanged: new Subject<SetCurrentPageOperation>(),
    searchResults: new Subject<SearchResultsCount>(),
    documentLoadInit: new Subject<NewDocumentLoadInit>(),
    documentLoadProgress: new Subject<DocumentLoadProgress>(),
    documentLoaded: new Subject<DocumentLoaded>(),
    documentLoadFailed: new Subject<DocumentLoadFailed>(),
    pageRendered: new Subject<{pageNumber: number, source: {rotation: number, scale: number, div: Element}}>(),
  };

  const mockFactory = {
    create: () => mockWrapper
  };

  const mockPrintService = {
    printDocumentNatively: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfViewerComponent, ErrorMessageComponent ]
    })
    .overrideComponent(PdfViewerComponent, {
      set: {
        providers: [
          { provide: PdfJsWrapperFactory, useValue: mockFactory },
          { provide: PrintService, useFactory: () => mockPrintService }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
    component.zoomValue = new BehaviorSubject<ZoomValue>({value: 1});
    component.currentPageChanged = new Subject<SetCurrentPageOperation>();
    component.searchResults = new Subject<SearchResultsCount>();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AnnotationsComponent]
      }
    });

    annotationFactory = fixture.debugElement.injector.get(ComponentFactoryResolver)
      .resolveComponentFactory(AnnotationsComponent);
    viewContainerRef = fixture.debugElement.injector.get(ViewContainerRef);

    await component.ngAfterContentInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should perform rotate operation', () => {
    spyOn(mockWrapper, 'rotate');
    component.rotateOperation = new RotateOperation(90);
    expect(mockWrapper.rotate).toHaveBeenCalledWith(90);
  });

  it('should perform zoom operation', () => {
    spyOn(component.zoomValue, 'next');
    spyOn(mockWrapper, 'setZoom');
    component.zoomOperation = new ZoomOperation(4);
    expect(component.zoomValue.next).toHaveBeenCalled();
    expect(mockWrapper.setZoom).toHaveBeenCalledWith(4);
  });

  it('should call step zoom operation', () => {
    spyOn(component.zoomValue, 'next');
    spyOn(mockWrapper, 'stepZoom');
    component.stepZoomOperation = new StepZoomOperation(0.5);
    expect(component.zoomValue.next).toHaveBeenCalled();
    expect(mockWrapper.stepZoom).toHaveBeenCalledWith(0.5);
  });

  it('should call the search operation', () => {
    spyOn(mockWrapper, 'search');
    const searchOperation = new SearchOperation('searchTerm', false, false, false, false, false);
    component.searchOperation = searchOperation;
    expect(mockWrapper.search).toHaveBeenCalledWith(searchOperation);
  });

  it('should call the print operation', () => {
    spyOn(mockPrintService, 'printDocumentNatively');
    component.url = 'derp';
    component.printOperation = new PrintOperation();
    expect(mockPrintService.printDocumentNatively).toHaveBeenCalledWith(component.url);
  });

  it('should download the pdf', () => {
    spyOn(mockWrapper, 'downloadFile');
    component.downloadOperation = new DownloadOperation();
    expect(mockWrapper.downloadFile).toHaveBeenCalledWith(component.url, component.downloadFileName);
  });

  it('should call set current page operation', () => {
    spyOn(mockWrapper, 'setPageNumber');
    component.setCurrentPage = new SetCurrentPageOperation(2);
    expect(mockWrapper.setPageNumber).toHaveBeenCalledWith(2);
  });

  it('should call change current page operation', () => {
    spyOn(mockWrapper, 'changePageNumber');
    component.changePageByDelta = new ChangePageByDeltaOperation(-2);
    expect(mockWrapper.changePageNumber).toHaveBeenCalledWith(-2);
  });

  it('clear the search when the search bar is closed', () => {
    spyOn(mockWrapper, 'clearSearch');
    component.searchBarHidden = true;
    expect(mockWrapper.clearSearch).toHaveBeenCalled();
  });

  it('test loadDocument is called when URL changes', async () => {
    const loadDocumentSpy = spyOn(mockWrapper, 'loadDocument');
    await component.ngOnChanges({
      url: new SimpleChange('a', 'b', true)
    });
    await component.ngOnChanges({
      url: new SimpleChange('b', 'c', true)
    });
    expect(loadDocumentSpy).toHaveBeenCalledTimes(2);
  });

  it('on NewDocumentLoadInit indicate document is loading', () => {
    mockWrapper.documentLoadInit.next(new NewDocumentLoadInit('abc'));
    expect(component.loadingDocument).toBeTruthy();
  });

  it('on DocumentLoadProgress indicate document loading progress', () => {
    mockWrapper.documentLoadProgress.next(new DocumentLoadProgress(10, 100));
    expect(component.loadingDocumentProgress).toBe(10);
    mockWrapper.documentLoadProgress.next(new DocumentLoadProgress(90, 100));
    expect(component.loadingDocumentProgress).toBe(90);
    mockWrapper.documentLoadProgress.next(new DocumentLoadProgress(200, 100));
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
    mockWrapper.documentLoadFailed.next(new DocumentLoadFailed());
    expect(component.errorMessage).toContain('Could not load the document');
    expect(component.loadingDocument).toBe(false);
  });

  // it('on page rendered add annotations related to this page', () => {
  //   const div = document.createElement('div');
  //   div.style.width = '100px';
  //   div.style.height = '100px';
  //   component.showAnnotations = true;
  //   component.annotationSet = annotationSet;
  //   mockWrapper.pageRendered.next({pageNumber: 1, source: {rotation: 0, scale: 1, div: div}});
  //   expect(div.childNodes.length).toBe(1);
  // });
});
