import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';

import { EmLoggerService } from '../../../logging/em-logger.service';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { RotateOperation, ZoomOperation, ZoomValue } from '../../model/viewer-operations';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ PdfViewerComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EmLoggerService,
        PdfJsWrapper
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

  // it('should run ngAfterViewInit', () => {
  //   // mock calls to pdfWrapper.initViewer to return mock this.pdfViewer and mock this.pdfFindController
  //   expect(component).toHaveBeenCalled();
  // });

  it('should perform rotate operation', () => {
    component.pdfViewer = {pagesRotation: 0};
    component.rotateOperation = new RotateOperation(90);
    expect(component.pdfViewer.pagesRotation).toEqual(90);
  });

  it('should perform zoom operation', () => {
    component.zoomValue = new Subject<ZoomValue>();
    spyOn(component.zoomValue, 'next');

    component.pdfViewer = {currentScaleValue: 2};
    component.zoomOperation = new ZoomOperation(4);
    expect(component.pdfViewer.currentScaleValue).toEqual(4);
    expect(component.zoomValue.next).toHaveBeenCalledWith({value: component.pdfViewer.currentScaleValue });
  });

  it('should set scale value to max value', () => {
    component.zoomValue = new Subject<ZoomValue>();
    component.pdfViewer = {currentScaleValue: 2};
    component.zoomOperation = new ZoomOperation(6);
    expect(component.pdfViewer.currentScaleValue).toEqual(5);
  });

  it('should set scale value to min value', () => {
    component.zoomValue = new Subject<ZoomValue>();
    component.pdfViewer = {currentScaleValue: 2};
    component.zoomOperation = new ZoomOperation(0.001);
    expect(component.pdfViewer.currentScaleValue).toEqual(0.1);
  });
});
