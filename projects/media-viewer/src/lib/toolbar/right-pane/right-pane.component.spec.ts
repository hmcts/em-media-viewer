import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarRightPaneComponent } from './right-pane.component';
import { ActionEvents } from '../../events/action-events';
import { DownloadOperation, PrintOperation } from '../../events/viewer-operations';
import { ToolbarButtonToggles } from '../../events/toolbar-button-toggles';
import { BehaviorSubject, Subject } from 'rxjs';

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
    component.showPrintBtn = true;
    component.showDownloadBtn = true;
    component.subToolbarHidden = new BehaviorSubject<boolean>(true);
    component.printEvent = new Subject<PrintOperation>();
    component.downloadEvent = new Subject<DownloadOperation>();

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show secondary toolbar', async(() => {
    component.subToolbarHidden.asObservable()
      .subscribe(subToolbarHidden => expect(subToolbarHidden).toBeTruthy());
  }));


  it('should toggle secondary toolbar visible', async(() => {
    component.toggleSecondaryToolbar();

    component.subToolbarHidden.asObservable()
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
