import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../toolbar/toolbar.module';
import { ConfirmActionDialogComponent } from './confirm-action-dialog.component';

describe('ConfirmActionDialogComponent', () => {
  let component: ConfirmActionDialogComponent;
  let fixture: ComponentFixture<ConfirmActionDialogComponent>;
  let toolbarEvents: ToolbarEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmActionDialogComponent ],
      providers: [{
        provide: ToolbarEventService,
        useValue: {
          icp: {
            confirmExit: () => {},
            leavingSession: {
              next: (a: boolean) => {}
            }
          }
        }
      }]
    });

    toolbarEvents = TestBed.get(ToolbarEventService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmActionDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit new leavingSession event on cancel', () => {
    spyOn(toolbarEvents.icp.leavingSession, 'next').and.callThrough();
    component.onCancel();

    expect(toolbarEvents.icp.leavingSession.next).toHaveBeenCalled();
  });

  it('should call confirmExit and emit a new leavingSession event', () => {
    spyOn(toolbarEvents.icp, 'confirmExit').and.callThrough();
    spyOn(toolbarEvents.icp.leavingSession, 'next').and.callThrough();
    component.onConfirm();

    expect(toolbarEvents.icp.confirmExit).toHaveBeenCalled();
    expect(toolbarEvents.icp.leavingSession.next).toHaveBeenCalled();
  });
});
