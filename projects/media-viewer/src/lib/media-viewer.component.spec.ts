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
import {reducers} from './store/reducers/reducers';
import {StoreModule} from '@ngrx/store';
import { Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('MediaViewerComponent', () => {
  let component: MediaViewerComponent;
  let fixture: ComponentFixture<MediaViewerComponent>;
  let api: AnnotationApiService;
  const commentService = {
    getUnsavedChanges: () => new Subject(),
    resetCommentSet: () => {}
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [MediaViewerComponent],
      providers: [
        { provide: CommentService, useValue: commentService },
        ToolbarButtonVisibilityService
      ],
      imports: [
        ToolbarModule,
        AnnotationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
        RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerComponent);
    component = fixture.componentInstance;
    api = TestBed.get(AnnotationApiService);
    component.contentType = 'pdf';
    component.ngAfterContentInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the default toolbar behaviour',
    inject([ToolbarButtonVisibilityService], (toolbarButtons) => {
      spyOn(toolbarButtons, 'setup').and.callThrough();
      component.contentType = 'pdf';
      component.url = 'url'

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

  it('should be convertible', () => {
    component.contentType = 'excel';

    expect(component.contentTypeConvertible()).toBeTruthy();
  });

  it('should not support content when content type is null', () => {
    component.contentType = null;

    expect(component.contentTypeUnsupported()).toBeTruthy();
    expect(component.contentTypeConvertible()).toBeFalsy();
  });

  it('should reset the type exception when the url is changed', () => {
    component.typeException = true;
    component.contentType = 'pdf';
    component.url = 'file.pdf';
    component.ngOnChanges({ url: new SimpleChange('file.pdf', 'unsupported.txt', false) });

    expect(component.typeException).toBeFalse();
  });

  it('should reset the event state when the url is changed', () => {
    component.contentType = 'pdf';
    component.url = 'file.pdf';
    component.toolbarEvents.zoomValueSubject.next(2);
    component.ngOnChanges({ url: new SimpleChange('file.pdf', 'text.pdf', false) });

    expect(component.toolbarEvents.zoomValueSubject.value).toBe(1);
  });

  it('should set documentTitle to null if the content type is image', () => {
    component.documentTitle = 'Document Title';
    component.contentType = 'image';
    component.url = 'file.jpg';
    component.ngOnChanges({ url: new SimpleChange('file.jpg', 'text.jpg', false) });

    expect(component.documentTitle).toBeNull();
  });


  it('should not set annotations$ when annotations disabled', () => {
    component.contentType = 'pdf';
    component.annotationSet$ = null;

    component.enableAnnotations = false;
    component.ngOnChanges({
      enableAnnotations: new SimpleChange(true, false, false)
    });

    expect(component.annotationSet$).toBe(null);
  });

  it('should set annotationApiUrl', () => {
    component.contentType = 'pdf';
    const ANNOTATION_API_URL = 'annotation-api-url';
    component.annotationApiUrl = ANNOTATION_API_URL;

    component.ngOnChanges({
      annotationApiUrl: new SimpleChange(true, false, false)
    });

    expect(api.annotationApiUrl).toBe(ANNOTATION_API_URL);
  });

  it('onMediaLoad should emit a ResponseType', () => {
    spyOn(component.mediaLoadStatus, 'emit');
    component.url = 'document-url';

    component.onMediaLoad(ResponseType.SUCCESS);
    expect(component.mediaLoadStatus.emit).toHaveBeenCalledTimes(1);
  });

  it('should set the default toolbar behaviour for convertible type', () => {
    const toolbarButtonsSpy = spyOn(component.toolbarButtons, 'setup');
    component.contentType = 'excel';
    component.enableAnnotations = true;

    component.setToolbarButtons();
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultPdfOptions, showHighlightButton: true, showDrawButton: true });
  })

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
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultUnsupportedOptions });
  });

  it('onLoadException should emit a ViewerException', () => {
    component.contentType = 'pdf';
    const viewerException = new ViewerException();
    const emitSpy = spyOn(component.viewerException, 'emit');

    component.onLoadException(viewerException);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('onLoadException should set type exception true', () => {
    component.contentType = 'pdf';
    component.typeException = false;
    const viewerException = new ViewerException();
    const toolbarButtonsSpy = spyOn(component.toolbarButtons, 'setup');

    component.onLoadException(viewerException);
    expect(component.typeException).toBeTrue();
    expect(component.contentType).toBeNull();
    expect(toolbarButtonsSpy).toHaveBeenCalledWith({ ...defaultUnsupportedOptions });
  });

  it('onLoadException should set type exception false', () => {
    component.contentType = null;
    component.typeException = true;
    const viewerException = new ViewerException();

    component.onLoadException(viewerException);
    expect(component.typeException).toBeFalse();
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

  describe('height param', () => {
    it('should calc height when input value is not provided', () => {
      component.height = undefined;
      fixture.detectChanges();

      expect(component.viewerHeight).toBeDefined();
    });

    it('should set height to input value', () => {
      const mockHeight = 'calc(100vh - 25px)';
      component.height = mockHeight;
      fixture.detectChanges();

      expect(component.viewerHeight).toEqual(mockHeight);
    });
  });
});
