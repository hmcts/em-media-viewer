import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MediaViewerComponent} from './media-viewer.component';
import {PdfViewerComponent} from './viewers/pdf-viewer/pdf-viewer.component';
import {ImageViewerComponent} from './viewers/image-viewer/image-viewer.component';
import {UnsupportedViewerComponent} from './viewers/unsupported-viewer/unsupported-viewer.component';
import {ToolbarModule} from './toolbar/toolbar.module';
import {
  ImageViewerToolbarButtons,
  PdfViewerToolbarButtons,
  UnsupportedViewerToolbarButtons
} from './events/toolbar-button-toggles';
import {ErrorMessageComponent} from './viewers/error-message/error.message.component';
import { AnnotationsModule } from './annotations/annotations.module';

describe('MediaViewerComponent', () => {
  let component: MediaViewerComponent;
  let fixture: ComponentFixture<MediaViewerComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        MediaViewerComponent,
        PdfViewerComponent,
        ImageViewerComponent,
        UnsupportedViewerComponent,
        ErrorMessageComponent
      ],
      imports: [ToolbarModule, AnnotationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should support content', () => {
    component.contentType = 'pdf';
    expect(component.contentTypeUnsupported()).toBeFalsy();
  });

  it('should not support content', () => {
    component.contentType = 'unsupported';
    expect(component.contentTypeUnsupported()).toBeTruthy();
  });

  it('should set toolbarButtonToggles for pdf', function () {
    component.contentType = 'pdf';
    component.ngOnInit();

    expect(component.toolbarButtonToggles).toEqual(new PdfViewerToolbarButtons());
  });

  it('should set toolbarButtonToggles for image', function () {
    component.contentType = 'image';
    component.ngOnInit();

    expect(component.toolbarButtonToggles).toEqual(new ImageViewerToolbarButtons());
  });

  it('should set toolbarButtonToggles for unsupported types', function () {
    component.contentType = 'unsupported';
    component.ngOnInit();

    expect(component.toolbarButtonToggles).toEqual(new UnsupportedViewerToolbarButtons());
  });
});
