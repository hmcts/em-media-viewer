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
      participantsListVisible: new BehaviorSubject(false),
    },
    toggleParticipantsList: () => {},
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
});
