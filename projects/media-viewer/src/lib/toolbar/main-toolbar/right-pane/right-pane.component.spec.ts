import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarRightPaneComponent } from './right-pane.component';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';
import { ToolbarEventService } from '../../toolbar-event.service';

describe('ToolbarRightPaneComponent', () => {
  let component: ToolbarRightPaneComponent;
  let fixture: ComponentFixture<ToolbarRightPaneComponent>;
  let nativeElement;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarRightPaneComponent ],
      providers: [ ToolbarButtonVisibilityService, ToolbarEventService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarRightPaneComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.toolbarButtons.showPrint = true;
    component.toolbarButtons.showDownload = true;
    component.toolbarButtons.showCommentSummary = true;
    component.enableAnnotations = true;

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
    const printSpy = spyOn(component.toolbarEvents.printSubject, 'next');
    const printButton = nativeElement.querySelector('button[id=print]');
    printButton.click();

    expect(printSpy).toHaveBeenCalledWith();
  });

  it('should emit download event', () => {
    const downloadSpy = spyOn(component.toolbarEvents.downloadSubject, 'next');
    const downloadButton = nativeElement.querySelector('button[id=download]');
    downloadButton.click();

    expect(downloadSpy).toHaveBeenCalledWith();
  });

  it('should emit toggleCommentsSummary event', () => {
    const commentSummarySpy = spyOn(component.toolbarEvents.showCommentSummary, 'next');
    const commentSummaryButton = nativeElement.querySelector('button[id=commentSummary]');
    commentSummaryButton.click();

    expect(commentSummarySpy).toHaveBeenCalledWith(true);
  });
});
