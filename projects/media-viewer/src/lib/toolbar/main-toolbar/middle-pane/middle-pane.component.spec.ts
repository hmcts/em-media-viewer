import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarMiddlePaneComponent } from './middle-pane.component';
import { ActionEvents } from '../../../shared/action-events';
import { RotateOperation, StepZoomOperation, ZoomOperation } from '../../../shared/viewer-operations';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';

describe('ToolbarMiddlePaneComponent', () => {
  let component: ToolbarMiddlePaneComponent;
  let fixture: ComponentFixture<ToolbarMiddlePaneComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarMiddlePaneComponent ],
      providers: [ ToolbarButtonVisibilityService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarMiddlePaneComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.toolbarButtons.showRotate = true;
    component.toolbarButtons.showZoom = true;
    component.zoomEvent = new ActionEvents().zoom;
    component.rotateEvent = new ActionEvents().rotate;
    component.stepZoomEvent = new ActionEvents().stepZoom;
    component.zoomValue = { value: 1 };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit rotate event with 90 degrees', () => {
    const rotateSpy = spyOn(component.rotateEvent, 'next');
    const rotateClkwiseBtn = nativeElement.querySelector('button[id=pageRotateCw]');
    rotateClkwiseBtn.click();

    expect(rotateSpy).toHaveBeenCalledWith(new RotateOperation(90));
  });

  it('should emit rotate event with -90 degrees', () => {
    const rotateSpy = spyOn(component.rotateEvent, 'next');
    const rotateCtrClkwiseBtn = nativeElement.querySelector('button[id=pageRotateCcw]');
    rotateCtrClkwiseBtn.click();

    expect(rotateSpy).toHaveBeenCalledWith(new RotateOperation(-90));
  });

  it('should emit zoom out event', () => {
    const stepZoom = spyOn(component.stepZoomEvent, 'next');
    const zoomOutButton = nativeElement.querySelector('button[id=zoomOut]');
    zoomOutButton.click();

    expect(stepZoom).toHaveBeenCalledWith(new StepZoomOperation(-0.1));
  });

  it('should emit zoom in event', () => {
    const stepZoom = spyOn(component.stepZoomEvent, 'next');
    const zoomInButton = nativeElement.querySelector('button[id=zoomIn]');
    zoomInButton.click();

    expect(stepZoom).toHaveBeenCalledWith(new StepZoomOperation(0.1));
  });

  it('should emit zoom in event', () => {
    const zoomSpy = spyOn(component.zoomEvent, 'next');
    component.zoom(25);

    expect(zoomSpy).toHaveBeenCalledWith(new ZoomOperation(25));
  });
});
