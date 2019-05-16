import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarRightPaneComponent } from './right-pane.component';
import { ActionEvents, DownloadOperation, PrintOperation } from '../../media-viewer.model';
import { BehaviorSubject } from 'rxjs';

describe('ToolbarRightPaneComponent', () => {
  let component: ToolbarRightPaneComponent;
  let fixture: ComponentFixture<ToolbarRightPaneComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarRightPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarRightPaneComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.toggleSubToolbarHidden = new BehaviorSubject<boolean>(true);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show secondary toolbar', async(() => {
    component.toggleSubToolbarHidden.asObservable()
      .subscribe(subToolbarHidden => expect(subToolbarHidden).toBeTruthy());
  }));


  it('should toggle secondary toolbar visible', async(() => {
    component.toggleSecondaryToolbar();

    component.toggleSubToolbarHidden.asObservable()
      .subscribe(subToolbarHidden => expect(subToolbarHidden).toBeFalsy());
  }));

  it('should emit print event', () => {
    const printSpy = spyOn(component.actionEvents.print, 'next');
    const printButton = nativeElement.querySelector('button[id=print]');
    printButton.click();

    expect(printSpy).toHaveBeenCalledWith(new PrintOperation());
  });

  it('should emit download event', () => {
    const downloadSpy = spyOn(component.actionEvents.download, 'next');
    const downloadButton = nativeElement.querySelector('button[id=download]');
    downloadButton.click();

    expect(downloadSpy).toHaveBeenCalledWith(new DownloadOperation());
  });
});
