import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsupportedViewerComponent } from './unsupported-viewer.component';
import { ErrorMessageComponent } from '../error-message/error.message.component';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';

describe('UnsupportedViewerComponent', () => {
  let component: UnsupportedViewerComponent;
  let fixture: ComponentFixture<UnsupportedViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsupportedViewerComponent, ErrorMessageComponent ],
      providers: [ ToolbarEventService ]
    })
    .compileComponents();
  }));

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
    component.toolbarEvents.download.next();
    expect(clickSpy).toHaveBeenCalledWith();
  });

  it('unsubscribe', () => {
    const unsubSpy = spyOn(component.toolbarEvents.download, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubSpy).toHaveBeenCalled();
  });

  it('subscribe', () => {
    const subSpy = spyOn(component.toolbarEvents.download, 'subscribe');
    component.ngOnInit();
    expect(subSpy).toHaveBeenCalled();
  });

});
