import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubToolbarComponent } from './sub-toolbar.component';
import {
  ActionEvents,
  DownloadOperation,
  PrintOperation,
  RotateOperation
} from '../../media-viewer.model';

fdescribe('SubToolbarComponent', () => {
  let component: SubToolbarComponent;
  let fixture: ComponentFixture<SubToolbarComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ SubToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubToolbarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.actionEvents = new ActionEvents();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit rotate event with 90 degrees', () => {
    const rotateSpy = spyOn(component.actionEvents.rotate, 'next');
    const rotateClkwiseBtn = nativeElement.querySelector('button[id=pageRotateCw]');
    rotateClkwiseBtn.click();

    expect(rotateSpy).toHaveBeenCalledWith(new RotateOperation(90));
  });

  it('should emit rotate event with -90 degrees', () => {
    const rotateSpy = spyOn(component.actionEvents.rotate, 'next');
    const rotateCtrClkwiseBtn = nativeElement.querySelector('button[id=pageRotateCcw]');
    rotateCtrClkwiseBtn.click();

    expect(rotateSpy).toHaveBeenCalledWith(new RotateOperation(-90));
  });

  it('should emit print event', () => {
    const printSpy = spyOn(component.actionEvents.print, 'next');
    const printBtn = nativeElement.querySelector('button[id=secondaryPrint]');
    printBtn.click();

    expect(printSpy).toHaveBeenCalledWith(new PrintOperation());
  });

  it('should emit download event', () => {
    const downloadSpy = spyOn(component.actionEvents.download, 'next');
    const downloadBtn = nativeElement.querySelector('button[id=secondaryDownload]');
    downloadBtn.click();

    expect(downloadSpy).toHaveBeenCalledWith(new DownloadOperation());
  });
});
