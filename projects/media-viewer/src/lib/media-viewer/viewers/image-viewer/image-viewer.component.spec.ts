import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageViewerComponent } from './image-viewer.component';
import { PrintOperation, RotateOperation, StepZoomOperation, ZoomOperation } from '../../media-viewer.model';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        ImageViewerComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.url = '/document-url';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should rotate image', () => {
    component.rotateOperation = new RotateOperation(90);

    expect(component.rotation).toBe(90);
    expect(component.transformStyle).toBe('scale(1) rotate(90deg)');
  });

  describe('zoom operation', () => {

    it('should zoom image by factor of 0.5 ', () => {
      component.zoomOperation = new ZoomOperation(0.5);

      expect(component.zoom).toBe(0.5);
      expect(component.transformStyle).toBe('scale(0.5) rotate(0deg)');
    });

    it('should zoom image by factor of 2', () => {
      component.zoomOperation = new StepZoomOperation(2);

      expect(component.zoom).toBe(2);
      expect(component.transformStyle).toBe('scale(2) rotate(0deg)');
    });

    it('should zoom image by maximum value 5', () => {
      component.zoomOperation = new ZoomOperation(5);
      component.stepZoomOperation = new StepZoomOperation(0.2);

      expect(component.zoom).toBe(5);
      expect(component.transformStyle).toBe('scale(5) rotate(0deg)');
    });

    it('should zoom image by minimum value 0.1', () => {
      component.zoomOperation = new ZoomOperation(0.1);
      component.stepZoomOperation = new StepZoomOperation(-0.2);

      expect(component.zoom).toBe(0.1);
      expect(component.transformStyle).toBe('scale(0.1) rotate(0deg)');
    });
  });

  it('should trigger print', () => {
    const print = () => {};
    const windowMock = { print } as Window;
    const windowOpenSpy = spyOn(window, 'open').and.returnValue(windowMock);
    const windowPrintSpy = spyOn(windowMock, 'print');
    component.printOperation = new PrintOperation();

    expect(windowOpenSpy).toHaveBeenCalledWith('/document-url');
    expect(windowPrintSpy).toHaveBeenCalled();
  });
});

