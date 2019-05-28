import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubToolbarComponent } from './sub-toolbar.component';
import { DownloadOperation, PrintOperation } from '../../model/viewer-operations';
import { Subject } from 'rxjs';

describe('SubToolbarComponent', () => {
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
    component.printEvent = new Subject<PrintOperation>();
    component.downloadEvent = new Subject<DownloadOperation>();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit print event', () => {
    const printSpy = spyOn(component.printEvent, 'next');
    const printBtn = nativeElement.querySelector('button[id=secondaryPrint]');
    printBtn.click();

    expect(printSpy).toHaveBeenCalledWith(new PrintOperation());
  });

  it('should emit download event', () => {
    const downloadSpy = spyOn(component.downloadEvent, 'next');
    const downloadBtn = nativeElement.querySelector('button[id=secondaryDownload]');
    downloadBtn.click();

    expect(downloadSpy).toHaveBeenCalledWith(new DownloadOperation());
  });
});
