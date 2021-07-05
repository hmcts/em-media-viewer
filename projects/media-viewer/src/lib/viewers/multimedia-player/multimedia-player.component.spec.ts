import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultimediaPlayerComponent } from './multimedia-player.component';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerUtilService } from '../viewer-util.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';

describe('MultimediaPlayerComponent', () => {
  let component: MultimediaPlayerComponent;
  let fixture: ComponentFixture<MultimediaPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MultimediaPlayerComponent ],
      providers: [ ToolbarEventService, ViewerUtilService ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultimediaPlayerComponent);
    component = fixture.componentInstance;
    component.url = 'document-url';
    component.multimediaPlayerEnabled = true;
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

  it('should reload video on changes', () => {
    const loadSpy = spyOn(component.videoPlayer.nativeElement, 'load');

    component.ngOnChanges({
      url: new SimpleChange('old-url', 'new-url', false)
    });

    expect(loadSpy).toHaveBeenCalledWith();
    expect(component.mimeTypeSupported).toBeFalse();
  });

  it('should confirm mime type is supported', () => {
    component.mimeTypeSupported = false;

    component.confirmVideoSupported();

    expect(component.mimeTypeSupported).toBeTrue();
  });
});
