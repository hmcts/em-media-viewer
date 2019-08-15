import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaViewerComponent } from './media-viewer.component';
import { PdfViewerComponent } from './viewers/pdf-viewer/pdf-viewer.component';
import { ImageViewerComponent } from './viewers/image-viewer/image-viewer.component';
import { UnsupportedViewerComponent } from './viewers/unsupported-viewer/unsupported-viewer.component';
import { ToolbarModule } from './toolbar/toolbar.module';
import { ErrorMessageComponent } from './viewers/error-message/error.message.component';
import { AnnotationsModule } from './annotations/annotations.module';
import { SimpleChange } from '@angular/core';
import { ResponseType, ViewerException } from './viewers/error-message/viewer-exception.model';
import { defaultImageOptions, defaultPdfOptions, defaultUnsupportedOptions } from './toolbar/toolbar-button-visibility.service';

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

  it('should set the default toolbar behaviours', () => {
    const toolbarButtonsSpy = spyOn(component, 'setToolbarButtons');

    component.ngAfterContentInit();
    expect(toolbarButtonsSpy).toHaveBeenCalled();
  });

  it('should support content', () => {
    component.contentType = 'pdf';
    expect(component.contentTypeUnsupported()).toBeFalsy();
  });

  it('should not support content', () => {
    component.contentType = 'unsupported';
    expect(component.contentTypeUnsupported()).toBeTruthy();
  });

  it('should reset the event state when the url is changed', async () => {
    component.toolbarEvents.zoomValue.next(2);
    component.ngOnChanges({ url: new SimpleChange('file.pdf', 'text.pdf', false) });

    expect(component.toolbarEvents.zoomValue.value).toBe(1);
  });

  it('onMediaLoad should emit a ResponseType', async () => {
    const emitSpy = spyOn(component.mediaLoadStatus, 'emit');

    component.onMediaLoad(ResponseType.SUCCESS);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should set the default toolbar behaviour for pdf viewer', () => {
    const toolbarButtonsSpy = spyOn(component.toolbarButtons, 'reset');
    component.contentType = 'pdf';
    component.enableAnnotations = true;

    component.setToolbarButtons();
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultPdfOptions, showHighlightButton: true, showDrawButton: true });
  });

  it('should set the default toolbar behaviour for image viewer', () => {
    const toolbarButtonsSpy = spyOn(component.toolbarButtons, 'reset');
    component.contentType = 'image';
    component.enableAnnotations = true;

    component.setToolbarButtons();
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultImageOptions, showDrawButton: true });
  });

  it('should set the default toolbar behaviour for unsupported viewer', () => {
    const toolbarButtonsSpy = spyOn(component.toolbarButtons, 'reset');
    component.contentType = 'xxxxxx';

    component.setToolbarButtons();
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultUnsupportedOptions });
  });

  it('onLoadException should emit a ViewerException', async () => {
    const viewerException = new ViewerException();
    const emitSpy = spyOn(component.viewerException, 'emit');

    component.onLoadException(viewerException);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
