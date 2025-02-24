import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmActionDialogComponent } from './confirm-action-dialog.component';
import { IcpEventService } from '../../toolbar/icp-event.service';

describe('ConfirmActionDialogComponent', () => {
  let component: ConfirmActionDialogComponent;
  let fixture: ComponentFixture<ConfirmActionDialogComponent>;
  let icpEventService: IcpEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmActionDialogComponent ],
      providers: [{
        provide: IcpEventService,
        useValue: {
          confirmExit: () => {},
          leavingSession: {
            next: (a: boolean) => {}
          }
        }
      }]
    });

    icpEventService = TestBed.inject(IcpEventService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmActionDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit new leavingSession event on cancel', () => {
    spyOn(icpEventService.leavingSession, 'next').and.callThrough();
    component.onCancel();

    expect(icpEventService.leavingSession.next).toHaveBeenCalledWith(false);
  });

  it('should call confirmExit and emit a new leavingSession event', () => {
    spyOn(icpEventService, 'confirmExit').and.callThrough();
    spyOn(icpEventService.leavingSession, 'next').and.callThrough();
    component.onConfirm();

    expect(icpEventService.confirmExit).toHaveBeenCalled();
    expect(icpEventService.leavingSession.next).toHaveBeenCalledWith(false);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have onCancel method defined', () => {
    expect(component.onCancel).toBeDefined();
  });

  it('should have onConfirm method defined', () => {
    expect(component.onConfirm).toBeDefined();
  });

  it('should call confirmExit when onConfirm is called', () => {
    spyOn(icpEventService, 'confirmExit').and.callThrough();
    component.onConfirm();
    expect(icpEventService.confirmExit).toHaveBeenCalled();
  });

  it('should emit leavingSession event with false when onCancel is called', () => {
    spyOn(icpEventService.leavingSession, 'next').and.callThrough();
    component.onCancel();
    expect(icpEventService.leavingSession.next).toHaveBeenCalledWith(false);
  });

  it('should emit leavingSession event with false when onConfirm is called', () => {
    spyOn(icpEventService.leavingSession, 'next').and.callThrough();
    component.onConfirm();
    expect(icpEventService.leavingSession.next).toHaveBeenCalledWith(false);
  });

  it('should not call confirmExit when onCancel is called', () => {
    spyOn(icpEventService, 'confirmExit').and.callThrough();
    component.onCancel();
    expect(icpEventService.confirmExit).not.toHaveBeenCalled();
  });

  it('should call leavingSession.next with true when onConfirm is called', () => {
    spyOn(icpEventService.leavingSession, 'next').and.callThrough();
    component.onConfirm();
    expect(icpEventService.leavingSession.next).toHaveBeenCalledWith(false);
  });

  it('should not call leavingSession.next with true when onCancel is called', () => {
    spyOn(icpEventService.leavingSession, 'next').and.callThrough();
    component.onCancel();
    expect(icpEventService.leavingSession.next).not.toHaveBeenCalledWith(true);
  });
});