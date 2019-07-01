import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarRightPaneComponent } from './right-pane.component';
import { DownloadOperation, PrintOperation } from '../../../shared/viewer-operations';
import { Subject } from 'rxjs';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';

describe('ToolbarRightPaneComponent', () => {
  let component: ToolbarRightPaneComponent;
  let fixture: ComponentFixture<ToolbarRightPaneComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarRightPaneComponent ],
      providers: [ ToolbarButtonVisibilityService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarRightPaneComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.toolbarButtons.showPrint = true;
    component.toolbarButtons.showDownload = true;
    component.printEvent = new Subject<PrintOperation>();
    component.downloadEvent = new Subject<DownloadOperation>();

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show secondary toolbar', async(() => {
    component.toolbarButtons.subToolbarHidden.asObservable()
      .subscribe(subToolbarHidden => expect(subToolbarHidden).toBeTruthy());
  }));


  it('should toggle secondary toolbar visible', async(() => {
    component.toggleSecondaryToolbar();

    component.toolbarButtons.subToolbarHidden.asObservable()
      .subscribe(subToolbarHidden => expect(subToolbarHidden).toBeFalsy());
  }));

  it('should emit print event', () => {
    const printSpy = spyOn(component.printEvent, 'next');
    const printButton = nativeElement.querySelector('button[id=print]');
    printButton.click();

    expect(printSpy).toHaveBeenCalledWith(new PrintOperation());
  });

  it('should emit download event', () => {
    const downloadSpy = spyOn(component.downloadEvent, 'next');
    const downloadButton = nativeElement.querySelector('button[id=download]');
    downloadButton.click();

    expect(downloadSpy).toHaveBeenCalledWith(new DownloadOperation());
  });
});
