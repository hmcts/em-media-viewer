import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {Store, StoreModule} from '@ngrx/store';
import { Subject } from 'rxjs';

import { MediaViewerComponent } from './media-viewer.component';
import { ToolbarButtonVisibilityService, ToolbarModule } from './toolbar/toolbar.module';
import { ToolbarEventService } from './toolbar/toolbar-event.service';
import { AnnotationsModule } from './annotations/annotations.module';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ResponseType, ViewerException } from './viewers/viewer-exception.model';
import {
  defaultImageOptions,
  defaultPdfOptions,
  defaultUnsupportedOptions
} from './toolbar/toolbar-button-visibility.service';
import { AnnotationApiService } from './annotations/services/annotation-api/annotation-api.service';
import { CommentService } from './annotations/comment-set/comment/comment.service';
import {reducers} from './store/reducers/reducers';
import * as fromRedactActions from './store/actions/redaction.actions';
import * as fromAnnoActions from './store/actions/annotation.actions';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TreeModule } from 'angular-tree-component';
import { MutableDivModule } from 'mutable-div';

describe('MediaViewerComponent', () => {
  let component: MediaViewerComponent;
  let fixture: ComponentFixture<MediaViewerComponent>;
  const commentService = {
    getUnsavedChanges: () => new Subject(),
    resetCommentSet: () => {}
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [MediaViewerComponent],
      providers: [
        { provide: CommentService, useValue: commentService },
        {
          provide: AnnotationApiService,
          useValue: {
            api: null
          }
        },
        ToolbarButtonVisibilityService,
        ToolbarEventService,
      ],
      imports: [
        ToolbarModule,
        AnnotationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
        RouterTestingModule,
        CommonModule,
        HttpClientModule,
        HttpClientTestingModule,
        TagInputModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TreeModule.forRoot(),
        MutableDivModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerComponent);
    component = fixture.componentInstance;
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
      component.url = 'url';

      fixture.detectChanges();

      expect(toolbarButtons.setup).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('.print')));
    })
  );

  it('should support content', () => {
    component.contentType = 'pdf';
    expect(component.isSupported()).toBeTruthy();
  });

  it('should support multimedia content', () => {
    component.contentType = 'mp3';
    expect(component.isMultimedia()).toBeTruthy();
  });

  it('should not support content', () => {
    component.contentType = 'unsupported';

    expect(component.isSupported()).toBeFalsy();
  });

  it('should be convertible', () => {
    component.contentType = 'excel';

    expect(component.needsConverting()).toBeTruthy();
  });

  it('should not support content when content type is null', () => {
    component.contentType = null;

    expect(component.isSupported()).toBeFalsy();
    expect(component.needsConverting()).toBeFalsy();
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

  it('should not load annotations when playing multimedia', inject([Store], (store) => {
    spyOn(store, 'dispatch');
    component.url = 'new-url';
    component.enableAnnotations = true;
    component.multimediaContent = true;

    component.ngOnChanges({
      url: new SimpleChange('old-url', 'new-url', false)
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(new fromAnnoActions.LoadAnnotationSet('new-url'));
  }));

  it('should load annotations when not playing multimedia', inject([Store], (store) => {
    spyOn(store, 'dispatch');
    component.url = 'new-url';
    component.enableAnnotations = true;
    component.multimediaContent = false;

    component.ngOnChanges({
      url: new SimpleChange('old-url', 'new-url', false)
    });

    expect(store.dispatch).toHaveBeenCalledWith(new fromAnnoActions.LoadAnnotationSet('new-url'));
  }));

  it('should not load redactions when playing multimedia', inject([Store], (store) => {
    spyOn(store, 'dispatch');
    component.url = 'new-url';
    component.enableRedactions = true;
    component.multimediaContent = true;

    component.ngOnChanges({
      url: new SimpleChange('old-url', 'new-url', false)
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(new fromRedactActions.LoadRedactions('new-url'));
  }));

  it('should load redactions when not playing multimedia', inject([Store], (store) => {
    spyOn(store, 'dispatch');
    component.url = 'new-url';
    component.enableRedactions = true;
    component.multimediaContent = false;

    component.ngOnChanges({
      url: new SimpleChange('old-url', 'new-url', false)
    });

    expect(store.dispatch).toHaveBeenCalledWith(new fromRedactActions.LoadRedactions('new-url'));
  }));

  it('should content variables on content changes', () => {
    component.multimediaContent = true;
    component.unsupportedContent = true;
    component.convertibleContent = true;

    component.ngOnChanges({
      contentType: new SimpleChange('pdf', 'image', false)
    });

    expect(component.multimediaContent).toBeFalse();
    expect(component.unsupportedContent).toBeFalse();
    expect(component.multimediaContent).toBeFalse();
  });

  it('should set annotationApiUrl', () => {
     const api = TestBed.inject(AnnotationApiService);
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

    it('should set viewHeight to height when component moved', () => {
      const mockHeight = 'calc(100vh - 25px)';
      component.height = mockHeight;

      const toolbarEvents = TestBed.inject(ToolbarEventService);
      toolbarEvents.redactionMode.next(true);
      fixture.detectChanges();

      expect(component.viewerHeight).toEqual(mockHeight);
    });

    it('should re-calc viewHeight when component moved and height input param omitted', () => {
      const viewerHeight = component.viewerHeight;
      const toolbarEvents = TestBed.inject(ToolbarEventService);

      toolbarEvents.redactionMode.next(true);
      fixture.detectChanges();

      expect(component.viewerHeight).not.toEqual(viewerHeight);
    });
  });
});
