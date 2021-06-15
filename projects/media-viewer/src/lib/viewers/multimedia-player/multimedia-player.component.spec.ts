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

  it('should extract relative url for hrs URLs', () => {
    const url = 'http://localhost:8080/hearing-recordings/recording-id/segments/0';
    component.url = url;

    component.ngOnChanges({ url: new SimpleChange(null, url, true)});

    expect(component.relativeUrl).toEqual('/hearing-recordings/recording-id/segments/0');
  });

  it('should not extract relative url for non hrs URLs', () => {
    const url = 'http://localhost:8080/documents/documentId/binary';
    component.url = url;

    component.ngOnChanges({ url: new SimpleChange(null, url, true)});

    expect(component.relativeUrl).toEqual(url);
  });
});
