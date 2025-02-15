import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { IcpToolbarComponent } from './icp-toolbar.component';
import { ToolbarEventService } from '../toolbar-event.service';
import { BehaviorSubject } from 'rxjs';
import { IcpEventService } from '../icp-event.service';

describe('IcpToolbarComponent', () => {
  let component: IcpToolbarComponent;
  let fixture: ComponentFixture<IcpToolbarComponent>;
  let toolbarEvents: ToolbarEventService;
  let icpEventService: IcpEventService
  const toolbarEventsMock = {
    toggleParticipantsList: () => {}
  };
  const icpEventServiceMock = {
    becomePresenter: jasmine.createSpy('becomePresenter'),
    stopPresenting: jasmine.createSpy('stopPresenting'),
    leaveSession: jasmine.createSpy('leaveSession'),
    participantsListVisible: new BehaviorSubject<boolean>(false),
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [IcpToolbarComponent],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [{ provide: ToolbarEventService, useValue: toolbarEventsMock }, { provide: IcpEventService, useValue: icpEventServiceMock }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IcpToolbarComponent);
    component = fixture.componentInstance;
    toolbarEvents = TestBed.inject(ToolbarEventService);
    icpEventService = TestBed.inject(IcpEventService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should present', () => {
    component.present();
    expect(icpEventService.becomePresenter).toHaveBeenCalled();
  });

  it('should stopPresenting', () => {
    component.stopPresenting();
    expect(icpEventService.stopPresenting).toHaveBeenCalled();
  });

  it('should leaveSession', () => {
    component.leaveIcpSession();
    expect(icpEventService.leaveSession).toHaveBeenCalled();
  });

  it('should show participants', () => {
    spyOn(toolbarEvents, 'toggleParticipantsList');

    component.showParticipantsList();

    expect(toolbarEvents.toggleParticipantsList).toHaveBeenCalledWith(true);
  });
});
