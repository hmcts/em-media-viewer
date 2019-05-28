import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MediaViewerComponent} from './media-viewer.component';
import {PdfViewerComponent} from './viewers/pdf-viewer/pdf-viewer.component';
import {ImageViewerComponent} from './viewers/image-viewer/image-viewer.component';
import {UnsupportedViewerComponent} from './viewers/unsupported-viewer/unsupported-viewer.component';
import {ToolbarModule} from './toolbar/toolbar.module';

describe('MediaViewerComponent', () => {
  let component: MediaViewerComponent;
  let fixture: ComponentFixture<MediaViewerComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        MediaViewerComponent,
        PdfViewerComponent,
        ImageViewerComponent,
        UnsupportedViewerComponent
      ],
      imports: [ToolbarModule]
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
});
