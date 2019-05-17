import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarMiddlePaneComponent } from './middle-pane.component';
import { ActionEvents } from '../../model/action-events';
import { StepZoomOperation, ZoomOperation } from '../../model/viewer-operations';

describe('ToolbarMiddlePaneComponent', () => {
  let component: ToolbarMiddlePaneComponent;
  let fixture: ComponentFixture<ToolbarMiddlePaneComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarMiddlePaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarMiddlePaneComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.zoomEvent = new ActionEvents().zoom;
    component.stepZoomEvent = new ActionEvents().stepZoom;
    component.zoomValue = { value: 1 };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit zoom out event', () => {
    const stepZoom = spyOn(component.stepZoomEvent, 'next');
    const zoomOutButton = nativeElement.querySelector('button[id=zoomOut]');
    zoomOutButton.click();

    expect(stepZoom).toHaveBeenCalledWith(new StepZoomOperation(-0.2));
  });

  it('should emit zoom in event', () => {
    const stepZoom = spyOn(component.stepZoomEvent, 'next');
    const zoomInButton = nativeElement.querySelector('button[id=zoomIn]');
    zoomInButton.click();

    expect(stepZoom).toHaveBeenCalledWith(new StepZoomOperation(0.2));
  });

  it('should emit zoom in event', () => {
    const zoomSpy = spyOn(component.zoomEvent, 'next');
    component.zoom(25);

    expect(zoomSpy).toHaveBeenCalledWith(new ZoomOperation(25));
  });
});
