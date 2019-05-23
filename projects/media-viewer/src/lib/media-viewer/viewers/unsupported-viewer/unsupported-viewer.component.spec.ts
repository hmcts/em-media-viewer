import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarToggles } from '../../model/toolbar-toggles';

import { UnsupportedViewerComponent } from './unsupported-viewer.component';
import { DownloadOperation } from '../../model/viewer-operations';
import { BehaviorSubject } from 'rxjs';

describe('UnsupportedViewerComponent', () => {
  let component: UnsupportedViewerComponent;
  let fixture: ComponentFixture<UnsupportedViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsupportedViewerComponent ]
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

  it('should show download button', () => {
    const mockToolbarToggles = new ToolbarToggles();
    spyOn(mockToolbarToggles.showDownloadBtn, 'next');
    component.toolbarToggles = mockToolbarToggles;
    expect(mockToolbarToggles.showDownloadBtn.next).toHaveBeenCalledWith(true);
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
