import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsupportedViewerComponent } from './unsupported-viewer.component';
import { ErrorMessageComponent } from '../error-message/error.message.component';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import {ViewerUtilService} from '../viewer-util.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('UnsupportedViewerComponent', () => {
  let component: UnsupportedViewerComponent;
  let fixture: ComponentFixture<UnsupportedViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsupportedViewerComponent, ErrorMessageComponent ],
      providers: [ ToolbarEventService, ViewerUtilService ],
      imports: [ HttpClientTestingModule ]
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

});
