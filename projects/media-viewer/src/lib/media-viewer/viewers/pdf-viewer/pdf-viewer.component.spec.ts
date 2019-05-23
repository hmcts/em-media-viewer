import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';
import { EmLoggerService } from '../../../logging/em-logger.service';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import {
  ChangePageByDeltaOperation,
  RotateOperation,
  SearchResultsCount,
  SetCurrentPageOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue,
  SearchOperation,
  DownloadOperation
} from '../../model/viewer-operations';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { ToolbarToggles } from '../../model/toolbar-toggles';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  const mockViewer = {
    pagesRotation: 0,
    currentPageNumber: 1,
    currentScaleValue: 2,
    eventBus: {
      on: () => {
      },
      dispatch: () => {
      }
    }
  };

  const mockWrapper = new PdfJsWrapper(
    new Subject<SearchResultsCount>(),
    new Subject<SetCurrentPageOperation>(),
    mockViewer,
    {} as any
  );

  const mockFactory = {
    create: () => mockWrapper
  };

  beforeEach(async(() => {
    mockWrapper.loadDocument = () => Promise.resolve();

    return TestBed.configureTestingModule({
      declarations: [ PdfViewerComponent ],
      providers: [
        EmLoggerService,
        { provide: PdfJsWrapperFactory, useValue: mockFactory }
      ]
    })
    .compileComponents();
  }));

  beforeEach(async () => {
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
    expect(component.zoomValue.next).toHaveBeenCalledWith({value: mockWrapper.setZoom(4) });
    expect(mockWrapper.setZoom).toHaveBeenCalledWith(4);
  });


  it('should call step zoom operation', () => {
    spyOn(component.zoomValue, 'next');
    spyOn(mockWrapper, 'stepZoom');
    component.stepZoomOperation = new StepZoomOperation(0.5);
    expect(component.zoomValue.next).toHaveBeenCalledWith({value: mockWrapper.stepZoom(0.5) });
    expect(mockWrapper.stepZoom).toHaveBeenCalledWith(0.5);
  });

  it('should call the search operation', () => {
    spyOn(mockWrapper, 'search');
    const searchOperation = new SearchOperation('searchTerm', false, false, false, false, false);
    component.searchOperation = searchOperation;
    expect(mockWrapper.search).toHaveBeenCalledWith(searchOperation);
  });

  // Why does this not work? I'm mocking the response from printService. Is it still running the method, just not returning its value?
  // it('should call the print operation', () => {
  //   spyOn(mockViewer.printService, 'printDocumentNatively');
  //   component.url = '';
  //   component.printOperation = new PrintOperation();
  //   expect(mockViewer.printService.printDocumentNatively).toHaveBeenCalledWith(component.url);
  // });

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
    spyOn(mockViewer.eventBus, 'dispatch');
    component.toolbarToggles = new ToolbarToggles();
    expect(mockViewer.eventBus.dispatch).toHaveBeenCalled();
  });
});
