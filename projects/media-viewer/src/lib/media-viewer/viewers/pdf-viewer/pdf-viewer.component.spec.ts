import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import {
  ChangePageByDeltaOperation,
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  SearchOperation,
  SearchResultsCount,
  SetCurrentPageOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../model/viewer-operations';
import { ToolbarToggles } from '../../model/toolbar-toggles';
import { PrintService } from '../../service/print.service';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  const mockWrapper = {
    loadDocument: () => Promise.resolve(),
    search: () => {},
    clearSearch: () => {},
    rotate: () => {},
    setZoom: () => {},
    stepZoom: () => {},
    downloadFile: () => {},
    setPageNumber: () => {},
    changePageNumber: () => {},
    currentPageChanged: new Subject<SetCurrentPageOperation>(),
    searchResults: new Subject<SearchResultsCount>()
  };

  const mockFactory = {
    create: () => mockWrapper
  };

  const mockPrintService = {
    printDocumentNatively: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfViewerComponent ]
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
    component.zoomValue = new Subject<ZoomValue>();
    component.currentPageChanged = new Subject<SetCurrentPageOperation>();
    component.searchResults = new Subject<SearchResultsCount>();

    await component.ngAfterViewInit();
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

  it('set toolbar toggles', () => {
    const toolbarToggles = new ToolbarToggles();

    spyOn(toolbarToggles.showSearchbarToggleBtn, 'next');
    spyOn(toolbarToggles.showZoomBtns, 'next');
    spyOn(toolbarToggles.showRotateBtns, 'next');
    spyOn(toolbarToggles.showNavigationBtns, 'next');
    spyOn(toolbarToggles.showDownloadBtn, 'next');
    spyOn(toolbarToggles.showPrintBtn, 'next');

    component.toolbarToggles = toolbarToggles;

    expect(toolbarToggles.showSearchbarToggleBtn.next).toHaveBeenCalledWith(true);
    expect(toolbarToggles.showZoomBtns.next).toHaveBeenCalledWith(true);
    expect(toolbarToggles.showRotateBtns.next).toHaveBeenCalledWith(true);
    expect(toolbarToggles.showNavigationBtns.next).toHaveBeenCalledWith(true);
    expect(toolbarToggles.showDownloadBtn.next).toHaveBeenCalledWith(true);
    expect(toolbarToggles.showPrintBtn.next).toHaveBeenCalledWith(true);
  });

  it('clear the search when the search bar is closed', () => {
    spyOn(mockWrapper, 'clearSearch');
    const toggles = new ToolbarToggles();
    component.toolbarToggles = toggles;
    toggles.searchBarHidden.next(true);
    expect(mockWrapper.clearSearch).toHaveBeenCalled();
  });

  // TODO In wrapper
  // it('should search the pdf', () => {
  //   component.searchOperation = new SearchOperation(2);
  //   component.searchOperation = new SearchOperation(0.5);
  //   expect(mockViewer.searchBoi).toEqual(2.5);
  // });

  // // TODO In wrapper
  // it('should print the pdf', () => {
  //   component.printOperation = new PrintOperation(2);
  //   component.PrintOperation = new PrintOperation(0.5);
  //   expect(mockViewer.PrintBoi).toEqual(2.5);
  // });

  // // TODO In wrapper
  // it('should download the pdf', () => {
  //   mockViewer.pdf = 1;
  //   component.pdf = new pdf(2);
  //   expect(mockViewer.currentPageNumber).toEqual(2);
  // });

});
