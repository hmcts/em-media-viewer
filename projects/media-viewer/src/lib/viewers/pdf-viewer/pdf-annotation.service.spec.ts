import { TestBed } from '@angular/core/testing';
import { PdfAnnotationService } from './pdf-annotation.service';
import { ElementRef, ViewContainerRef } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewer-event.service';
import { PageEvent, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { CommentService } from '../../annotations/comment-set/comment/comment.service';
import { AnnotationSetService } from './annotation-set.service';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';

describe('PdfAnnotationService', () => {

  let service: PdfAnnotationService;
  let annoSetService: AnnotationSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PdfAnnotationService,
        ToolbarEventService,
        ViewerEventService,
        AnnotationSetService,
        ViewContainerRef,
        CommentService
      ]
    });
    service = TestBed.get(PdfAnnotationService);
    annoSetService = TestBed.get(AnnotationSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init services', () => {
    const mockWrapper = {} as PdfJsWrapper;
    const mockViewer = {} as ElementRef;
    spyOn(annoSetService, 'init');

    service.init(mockWrapper, mockViewer);

    expect(annoSetService.init).toHaveBeenCalled();
  });

  it('should add annotations and comments', () => {
    const pageRenderEvent = {} as PageEvent;
    spyOn(annoSetService, 'addAnnotationsToPage');

    service.addAnnotations(pageRenderEvent);

    expect(annoSetService.addAnnotationsToPage).toHaveBeenCalled();
  });

  it('should add annotationSet to page', () => {
    spyOn(annoSetService, 'addAnnoSetToPage');

    service.addAnnoSetToPage();

    expect(annoSetService.addAnnoSetToPage).toHaveBeenCalled();
  });

  it('should build annotationSet components', () => {
    const annotationSet = {} as AnnotationSet;
    spyOn(annoSetService, 'destroyComponents');
    spyOn(annoSetService, 'setAnnotationSet');

    service.buildAnnoSetComponents(annotationSet);

    expect(service.annotationSet).toBe(annotationSet);
    expect(annoSetService.destroyComponents).toHaveBeenCalled();
    expect(annoSetService.setAnnotationSet).toHaveBeenCalledWith(annotationSet);
  });
});
