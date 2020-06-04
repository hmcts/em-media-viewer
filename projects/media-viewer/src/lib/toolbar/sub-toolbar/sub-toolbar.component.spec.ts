import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubToolbarComponent } from './sub-toolbar.component';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarEventService } from '../toolbar-event.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';

describe('SubToolbarComponent', () => {
  let component: SubToolbarComponent;
  let fixture: ComponentFixture<SubToolbarComponent>;
  let nativeElement;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [ SubToolbarComponent ],
      imports: [ StoreModule.forFeature('media-viewer', reducers), StoreModule.forRoot({})],
      providers: [ ToolbarButtonVisibilityService, ToolbarEventService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubToolbarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit print event', () => {
    component.toolbarButtons.showPrint = true;
    fixture.detectChanges();
    const printSpy = spyOn(component.toolbarEvents, 'print');
    const printBtn = nativeElement.querySelector('button[id=secondaryPrint]');
    printBtn.click();

    expect(printSpy).toHaveBeenCalled();
  });

  it('should emit download event', () => {
    component.toolbarButtons.showDownload = true;
    fixture.detectChanges();
    const downloadSpy = spyOn(component.toolbarEvents, 'download');
    const downloadBtn = nativeElement.querySelector('button[id=secondaryDownload]');
    downloadBtn.click();

    expect(downloadSpy).toHaveBeenCalled();
  });

  it('should emit highlight mode event', () => {
    component.toolbarButtons.showHighlightButton = true;
    fixture.detectChanges();
    const eventSpy = spyOn(component.toolbarEvents.highlightModeSubject, 'next');
    const button = nativeElement.querySelector('button[id=secondaryHighlightToggle]');
    button.click();

    expect(eventSpy).toHaveBeenCalledWith(true);
  });

  it('should emit draw mode event', () => {
    component.toolbarButtons.showDrawButton = true;
    fixture.detectChanges();
    const eventSpy = spyOn(component.toolbarEvents.drawModeSubject, 'next');
    const button = nativeElement.querySelector('button[id=secondaryToggleDrawButton]');
    button.click();

    expect(eventSpy).toHaveBeenCalledWith(true);
  });

  it('should emit rotate ccw mode event', () => {
    component.toolbarButtons.showRotate = true;
    fixture.detectChanges();
    const eventSpy = spyOn(component.toolbarEvents, 'rotate');
    const button = nativeElement.querySelector('button[id=secondaryRotateCcw]');
    button.click();

    expect(eventSpy).toHaveBeenCalledWith(270);
  });

  it('should emit rotate cw mode event', () => {
    component.toolbarButtons.showRotate = true;
    fixture.detectChanges();
    const eventSpy = spyOn(component.toolbarEvents, 'rotate');
    const button = nativeElement.querySelector('button[id=secondaryRotateCw]');
    button.click();

    expect(eventSpy).toHaveBeenCalledWith(90);
  });
});
