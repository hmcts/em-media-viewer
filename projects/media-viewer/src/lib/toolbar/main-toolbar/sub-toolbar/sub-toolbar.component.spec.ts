import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubToolbarComponent } from './sub-toolbar.component';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';
import { ToolbarEventService } from '../../toolbar-event.service';

describe('SubToolbarComponent', () => {
  let component: SubToolbarComponent;
  let fixture: ComponentFixture<SubToolbarComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ SubToolbarComponent ],
      providers: [ ToolbarButtonVisibilityService, ToolbarEventService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubToolbarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit print event', () => {
    const printSpy = spyOn(component.toolbarEvents.print, 'next');
    const printBtn = nativeElement.querySelector('button[id=secondaryPrint]');
    printBtn.click();

    expect(printSpy).toHaveBeenCalledWith();
  });

  it('should emit download event', () => {
    const downloadSpy = spyOn(component.toolbarEvents.download, 'next');
    const downloadBtn = nativeElement.querySelector('button[id=secondaryDownload]');
    downloadBtn.click();

    expect(downloadSpy).toHaveBeenCalledWith();
  });
});
