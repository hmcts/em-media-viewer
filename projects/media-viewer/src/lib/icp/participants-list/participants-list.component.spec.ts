import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantsListComponent } from './participants-list.component';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { BehaviorSubject } from 'rxjs';

describe('ParticipantsListComponent', () => {
  let component: ParticipantsListComponent;
  let fixture: ComponentFixture<ParticipantsListComponent>;
  let toolbarEvents: ToolbarEventService;
  const toolbarEventsMock = {
    icp: {
      toggleIcpParticipantsList: () => {},
      icpParticipantsListVisible: new BehaviorSubject(false),
    },
    commentsPanelVisible: new BehaviorSubject(false)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantsListComponent ],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [{ provide: ToolbarEventService, useValue: toolbarEventsMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    toolbarEvents = TestBed.get(ToolbarEventService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to icpParticipantsListVisible', () => {
    toolbarEvents.icp.icpParticipantsListVisible.next(true);
    expect(component.showParticipantsList).toBeTruthy();
  });

  it('should subscribe to commentsPanelVisible', () => {
    spyOn(toolbarEvents.icp, 'toggleIcpParticipantsList');
    toolbarEvents.commentsPanelVisible.next(true);
    expect(toolbarEvents.icp.toggleIcpParticipantsList).toHaveBeenCalledWith(false);
  });
});
