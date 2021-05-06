import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioPlayerComponent } from './audio-player.component';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerUtilService } from '../viewer-util.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioPlayerComponent ],
      providers: [ ToolbarEventService, ViewerUtilService ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    component.url = 'document-url';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click download button', () => {
    const clickSpy = spyOn(component.downloadLink.nativeElement, 'click');

    component.toolbarEvents.downloadSubject.next();
    fixture.detectChanges();

    expect(clickSpy).toHaveBeenCalledWith();
  });
});
