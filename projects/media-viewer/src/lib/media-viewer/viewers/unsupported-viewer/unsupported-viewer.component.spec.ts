import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsupportedViewerComponent } from './unsupported-viewer.component';
import { DownloadOperation } from '../../model/viewer-operations';
import {ErrorMessageComponent} from '../error-message/error.message.component';

describe('UnsupportedViewerComponent', () => {
  let component: UnsupportedViewerComponent;
  let fixture: ComponentFixture<UnsupportedViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsupportedViewerComponent, ErrorMessageComponent ]
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
    component.downloadOperation = new DownloadOperation();
    expect(clickSpy).toHaveBeenCalledWith();
  });

  it('should not click download button', () => {
    const clickSpy = spyOn(component.downloadLink.nativeElement, 'click');
    component.downloadOperation = null;
    expect(clickSpy).toHaveBeenCalledTimes(0);
  });
});
