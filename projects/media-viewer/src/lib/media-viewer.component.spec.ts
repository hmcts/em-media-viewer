import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MediaViewerComponent } from './media-viewer.component';
import { ToolbarButtonVisibilityService, ToolbarModule } from './toolbar/toolbar.module';
import { AnnotationsModule } from './annotations/annotations.module';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ResponseType, ViewerException } from './viewers/viewer-exception.model';
import {
  defaultImageOptions,
  defaultPdfOptions,
  defaultUnsupportedOptions
} from './toolbar/toolbar-button-visibility.service';
import { AnnotationApiService } from './annotations/annotation-api.service';
import { CommentService } from './annotations/comment-set/comment/comment.service';
import { By } from '@angular/platform-browser';
import {reducers} from './store/reducers';
import {StoreModule} from '@ngrx/store';

describe('MediaViewerComponent', () => {
  let component: MediaViewerComponent;
  let fixture: ComponentFixture<MediaViewerComponent>;
  let api: AnnotationApiService;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        MediaViewerComponent
      ],
      providers: [
        CommentService, ToolbarButtonVisibilityService
      ],
      imports: [
        ToolbarModule,
        AnnotationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerComponent);
    component = fixture.componentInstance;
    api = TestBed.get(AnnotationApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the default toolbar behaviour',
    inject([ToolbarButtonVisibilityService], (toolbarButtons) => {
      spyOn(toolbarButtons, 'setup').and.callThrough();
      component.contentType = 'pdf';
      component.url = 'url'

      component.ngAfterContentInit();
      fixture.detectChanges();

      expect(toolbarButtons.setup).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('.print')));
    })
  );

  it('should support content', () => {
    component.contentType = 'pdf';
    expect(component.contentTypeUnsupported()).toBeFalsy();
  });

  it('should not support content', () => {
    component.contentType = 'unsupported';

    expect(component.contentTypeUnsupported()).toBeTruthy();
  });

  it('should not support content when content type is null', () => {
    component.contentType = null;

    expect(component.contentTypeUnsupported()).toBeTruthy();
  });

  it('should reset the event state when the url is changed', () => {
    component.toolbarEvents.zoomValueSubject.next(2);
    component.ngOnChanges({ url: new SimpleChange('file.pdf', 'text.pdf', false) });

    expect(component.toolbarEvents.zoomValueSubject.value).toBe(1);
  });

  it('should set documentTitle to null if the content type is image', () => {
    component.documentTitle = 'Document Title';
    component.contentType = 'image';
    component.ngOnChanges({ url: new SimpleChange('file.jpg', 'text.jpg', false) });

    expect(component.documentTitle).toBeNull();
  });


  it('should not set annotations$ when annotations disabled', () => {
    component.annotationSet$ = null;

    component.enableAnnotations = false;
    component.ngOnChanges({
      enableAnnotations: new SimpleChange(true, false, false)
    });

    expect(component.annotationSet$).toBe(null);
  });

  it('should set annotationApiUrl', () => {
    const ANNOTATION_API_URL = 'annotation-api-url';
    component.annotationApiUrl = ANNOTATION_API_URL;

    component.ngOnChanges({
      annotationApiUrl: new SimpleChange(true, false, false)
    });

    expect(api.annotationApiUrl).toBe(ANNOTATION_API_URL);
  });

  it('onMediaLoad should emit a ResponseType', () => {
    const emitSpy = spyOn(component.mediaLoadStatus, 'emit');

    component.onMediaLoad(ResponseType.SUCCESS);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should set the default toolbar behaviour for pdf viewer', () => {
    const toolbarButtonsSpy = spyOn(component.toolbarButtons, 'setup');
    component.contentType = 'pdf';
    component.enableAnnotations = true;

    component.setToolbarButtons();
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultPdfOptions, showHighlightButton: true, showDrawButton: true });
  });

  it('should set the default toolbar behaviour for image viewer', () => {
    const toolbarButtonsSpy = spyOn(component.toolbarButtons, 'setup');
    component.contentType = 'image';
    component.enableAnnotations = true;

    component.setToolbarButtons();
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultImageOptions, showDrawButton: true });
  });

  it('should set the default toolbar behaviour for unsupported viewer', () => {
    const toolbarButtonsSpy = spyOn(component.toolbarButtons, 'setup');
    component.contentType = 'xxxxxx';

    component.setToolbarButtons();
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultUnsupportedOptions, showCommentSummary: false });
  });

  it('onLoadException should emit a ViewerException', () => {
    const viewerException = new ViewerException();
    const emitSpy = spyOn(component.viewerException, 'emit');

    component.onLoadException(viewerException);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('onUnsavedChanges should emit a boolean value', () => {
    const emitSpy = spyOn(component.unsavedChanges, 'emit');

    component.onCommentChange(true);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('onDocumentTitleChange should update the document title value', () => {
    const newTitle = 'New Bundle';
    component.documentTitle = 'Document Title for Evidence';

    component.onDocumentTitleChange(newTitle);
    expect(component.documentTitle).toEqual(newTitle);
  });
});
