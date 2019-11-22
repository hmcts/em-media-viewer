import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ImageViewerComponent } from './image-viewer.component';
import { PrintService } from '../../print.service';
import { ErrorMessageComponent } from '../error-message/error.message.component';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';
import { AnnotationsModule } from '../../annotations/annotations.module';
import { annotationSet } from '../../../assets/annotation-set';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewer-event.service';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;
  let nativeElement;
  const DOCUMENT_URL = 'document-url';

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        ErrorMessageComponent,
        ImageViewerComponent
      ],
      imports: [
        AnnotationsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.url = DOCUMENT_URL;
    component.annotationSet = { ...annotationSet };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should rotate image',
    inject([ToolbarEventService],(toolbarEvents: ToolbarEventService) => {
      toolbarEvents.rotateSubject.next(90);

      expect(component.rotation).toBe(90);
  }));

  describe('zoom operation', () => {

    it('should zoom image by factor of 0.5 ',
      inject([ToolbarEventService],(toolbarEvents: ToolbarEventService) => {
        toolbarEvents.zoomSubject.next(0.5);
        expect(component.zoom).toBe(0.5);
    }));

    it('should zoom image by factor of 2',
      inject([ToolbarEventService],(toolbarEvents: ToolbarEventService) => {
        toolbarEvents.zoomSubject.next(2);

        expect(component.zoom).toBe(2);
    }));

    it('should zoom image by maximum value 5',
      inject([ToolbarEventService],(toolbarEvents: ToolbarEventService) => {
        toolbarEvents.zoomSubject.next(5);
        toolbarEvents.stepZoomSubject.next(0.1);

        expect(component.zoom).toBe(5);
    }));

    it('should zoom image by minimum value 0.1',
      inject([ToolbarEventService],(toolbarEvents: ToolbarEventService) => {
        toolbarEvents.zoomSubject.next(0.1);
        toolbarEvents.stepZoomSubject.next(-0.1);

        expect(component.zoom).toBe(0.1);
    }));
  });

  it('should trigger print', inject([PrintService, ToolbarEventService],
    (printService: PrintService, toolbarEvents: ToolbarEventService) => {
    const printSpy = spyOn(printService, 'printDocumentNatively');
    toolbarEvents.printSubject.next();

    expect(printSpy).toHaveBeenCalledWith(DOCUMENT_URL);
  }));

  it('should trigger download',
    inject([ToolbarEventService],(toolbarEvents: ToolbarEventService) => {
      const anchor = document.createElement('a');
      spyOn(document, 'createElement').and.returnValue(anchor);
      component.downloadFileName = 'download-filename';

      toolbarEvents.downloadSubject.next();

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(anchor.href).toContain(DOCUMENT_URL);
      expect(anchor.download).toBe('download-filename');
  }));

  it('when errorMessage available show error message', () => {
    expect(fixture.debugElement.query(By.css('.image-container')).nativeElement.className).not.toContain('hidden');
    expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBe(null);
    component.errorMessage = 'errorx';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.image-container'))).toBeNull();
    expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBeTruthy();
  });

  it('when url changes the error message is reset', async () => {
    component.errorMessage = 'errox';
    component.url = 'x';
    component.ngOnChanges({
      url: new SimpleChange('a', 'b', true)
    });
    expect(component.errorMessage).toBeNull();
  });

  it('on load error show error message', () => {
    component.url = 'x';
    component.onLoadError(component.url);
    expect(component.errorMessage).toContain('Could not load the image');
  });

  it('should show comments panel',
    inject([ViewerEventService],(viewerEvents: ViewerEventService) => {
      component.showCommentsPanel = false;
      const imageContainer = fixture.debugElement.query(By.css('.image-container'));

      viewerEvents.commentsPanelToggle.next(true);
      fixture.detectChanges();

      expect(component.showCommentsPanel).toBeTruthy();
      expect(imageContainer.nativeElement.className).toContain('show-comments-panel');
  }));

  it('should hide comments panel',
    inject([ViewerEventService],(viewerEvents: ViewerEventService) => {
      component.showCommentsPanel = true;
      const imageContainer = fixture.debugElement.query(By.css('.image-container'));

      viewerEvents.commentsPanelToggle.next(false);
      fixture.detectChanges();

      expect(component.showCommentsPanel).toBeFalsy();
      expect(imageContainer.nativeElement.className).not.toContain('show-comments-panel');
  }));

  it('should toggle comments panel',
    inject([ViewerEventService], (viewerEvents: ViewerEventService) => {
      spyOn(viewerEvents, 'toggleCommentsPanel');

      component.toggleCommentsPanel();

      expect(viewerEvents.toggleCommentsPanel).toHaveBeenCalledWith(false);
    }));
});

