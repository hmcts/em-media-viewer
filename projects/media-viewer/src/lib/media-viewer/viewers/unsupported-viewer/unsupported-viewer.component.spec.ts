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

  // should it toggle or turn on? Check with taleb
  // fit('should show download button', () => {
  //   const localToolbarToggles = new ToolbarToggles();
  //   spyOn(component.toolbarToggles.showDownloadBtn, 'next');
  //   component.toolbarToggles = localToolbarToggles;
  //   expect(component.toolbarToggles.showDownloadBtn.next).toHaveBeenCalledWith(true);
  // });

  it('should click download button', () => {
    const clickSpy = spyOn(component.downloadLink.nativeElement, 'click');
    component.downloadOperation = new DownloadOperation();
    expect(clickSpy).toHaveBeenCalledWith();
  });
});
