import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarMiddlePaneComponent } from './middle-pane.component';
import { ActionEvents, ZoomOperation } from '../../media-viewer.model';

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
    component.zoomEvent = new ActionEvents();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit zoom out event', () => {
    const zoomSpy = spyOn(component.zoomEvent.zoom, 'next');
    const zoomOutButton = nativeElement.querySelector('button[id=zoomOut]');
    zoomOutButton.click();

    expect(zoomSpy).toHaveBeenCalledWith(new ZoomOperation(-0.2));
  });

  it('should emit zoom in event', () => {
    const zoomSpy = spyOn(component.zoomEvent.zoom, 'next');
    const zoomInButton = nativeElement.querySelector('button[id=zoomIn]');
    zoomInButton.click();

    expect(zoomSpy).toHaveBeenCalledWith(new ZoomOperation(0.2));
  });
});
