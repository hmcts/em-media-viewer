import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsupportedViewerComponent } from './unsupported-viewer.component';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerUtilService } from '../viewer-util.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UnsupportedViewerComponent', () => {
  let component: UnsupportedViewerComponent;
  let fixture: ComponentFixture<UnsupportedViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsupportedViewerComponent ],
      providers: [ ToolbarEventService, ViewerUtilService ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsupportedViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click download button', () => {
    const clickSpy = spyOn(component.downloadLink.nativeElement, 'click');

    component.toolbarEvents.downloadSubject.next();
    fixture.detectChanges();

    expect(clickSpy).toHaveBeenCalledWith();
  });

  it('ngOnInit should emit a ViewerException for type exception is false', () => {
    component.typeException = false;
    const emitSpy = spyOn(component.unsupportedViewerException, 'emit');

    component.ngOnInit();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('ngOnInit should not emit a ViewerException for type exception is true', () => {
    component.typeException = true;
    const emitSpy = spyOn(component.unsupportedViewerException, 'emit');

    component.ngOnInit();
    expect(emitSpy).toHaveBeenCalledTimes(0);
  });
});
