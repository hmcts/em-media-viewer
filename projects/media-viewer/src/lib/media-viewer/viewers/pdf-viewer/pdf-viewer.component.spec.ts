import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';
import { EmLoggerService } from '../../../logging/em-logger.service';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import {
  RotateOperation,
  SearchResultsCount,
  SetCurrentPageOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../model/viewer-operations';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  const mockViewer = {
    pagesRotation: 0,
    currentScaleValue: 2,
    eventBus: {
      on: () => {}
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
      schemas: [NO_ERRORS_SCHEMA],
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

  // it('should run ngAfterViewInit', () => {
  //   // mock calls to pdfWrapper.initViewer to return mock this.pdfViewer and mock this.pdfFindController
  //   expect(component).toHaveBeenCalled();
  // });

  it('should perform rotate operation', () => {
    expect(mockViewer.pagesRotation).toEqual(0);
    component.rotateOperation = new RotateOperation(90);
    expect(mockViewer.pagesRotation).toEqual(90);
  });

  it('should perform zoom operation', () => {
    spyOn(component.zoomValue, 'next');

    component.zoomOperation = new ZoomOperation(4);
    expect(mockViewer.currentScaleValue).toEqual(4);
    expect(component.zoomValue.next).toHaveBeenCalledWith({value: mockViewer.currentScaleValue });
  });

  it('should set scale value to max value', () => {
    component.zoomOperation = new ZoomOperation(6);
    expect(mockViewer.currentScaleValue).toEqual(5);
  });

  it('should set scale value to min value', () => {
    component.zoomOperation = new ZoomOperation(0.001);
    expect(mockViewer.currentScaleValue).toEqual(0.1);
  });

  it('should step the zoom', () => {
    component.zoomOperation = new ZoomOperation(2);
    component.stepZoomOperation = new StepZoomOperation(0.5);
    expect(mockViewer.currentScaleValue).toEqual(2.5);
  });
});
