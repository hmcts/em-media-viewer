import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarMiddlePaneComponent } from './middle-pane.component';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';
import { ToolbarEventService } from '../../toolbar-event.service';

describe('ToolbarMiddlePaneComponent', () => {
  let component: ToolbarMiddlePaneComponent;
  let fixture: ComponentFixture<ToolbarMiddlePaneComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarMiddlePaneComponent ],
      providers: [ ToolbarButtonVisibilityService, ToolbarEventService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarMiddlePaneComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.toolbarButtons.showRotate = true;
    component.toolbarButtons.showZoom = true;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit rotate event with 90 degrees', () => {
    const rotateSpy = spyOn(component.toolbarEvents.rotate, 'next');
    const rotateClkwiseBtn = nativeElement.querySelector('button[id=pageRotateCw]');
    rotateClkwiseBtn.click();

    expect(rotateSpy).toHaveBeenCalledWith(90);
  });

  it('should emit rotate event with 270 degrees', () => {
    const rotateSpy = spyOn(component.toolbarEvents.rotate, 'next');
    const rotateCtrClkwiseBtn = nativeElement.querySelector('button[id=pageRotateCcw]');
    rotateCtrClkwiseBtn.click();

    expect(rotateSpy).toHaveBeenCalledWith(270);
  });

  it('should emit zoom out event', () => {
    const stepZoom = spyOn(component.toolbarEvents.stepZoom, 'next');
    const zoomOutButton = nativeElement.querySelector('button[id=zoomOut]');
    zoomOutButton.click();

    expect(stepZoom).toHaveBeenCalledWith(-0.1);
  });

  it('should emit zoom in event', () => {
    const stepZoom = spyOn(component.toolbarEvents.stepZoom, 'next');
    const zoomInButton = nativeElement.querySelector('button[id=zoomIn]');
    zoomInButton.click();

    expect(stepZoom).toHaveBeenCalledWith(0.1);
  });

  it('should emit zoom in event', () => {
    const zoomSpy = spyOn(component.toolbarEvents.zoom, 'next');
    component.zoom('25');

    expect(zoomSpy).toHaveBeenCalledWith(25);
  });
});
