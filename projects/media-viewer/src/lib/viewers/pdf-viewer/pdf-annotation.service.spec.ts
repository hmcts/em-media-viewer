import { TestBed } from '@angular/core/testing';
import { PdfAnnotationService } from './pdf-annotation.service';
import { ElementRef, ViewContainerRef } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewer-event.service';
import { PageEvent, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { CommentService } from '../../annotations/comment-set/comment/comment.service';
import { AnnotationSetService } from './annotation-set.service';
import { CommentSetService } from './comment-set.service';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';

describe('PdfAnnotationService', () => {

  let service: PdfAnnotationService;
  let annoSetService: AnnotationSetService;
  let commentSetService: CommentSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PdfAnnotationService,
        ToolbarEventService,
        ViewerEventService,
        AnnotationSetService,
        ViewContainerRef,
        CommentSetService,
        CommentService
      ]
    });
    service = TestBed.get(PdfAnnotationService);
    annoSetService = TestBed.get(AnnotationSetService);
    commentSetService = TestBed.get(CommentSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init services', () => {
    const mockWrapper = {} as PdfJsWrapper;
    const mockViewer = {} as ElementRef;
    spyOn(annoSetService, 'init');
    spyOn(commentSetService, 'init');

    service.init(mockWrapper, mockViewer);

    expect(annoSetService.init).toHaveBeenCalled();
    expect(commentSetService.init).toHaveBeenCalled();
  });

  it('should add annotations and comments', () => {
    const pageRenderEvent = {} as PageEvent;
    spyOn(annoSetService, 'addAnnotationsToPage');
    spyOn(commentSetService, 'renderCommentsOnPage');

    service.addAnnotations(pageRenderEvent);

    expect(annoSetService.addAnnotationsToPage).toHaveBeenCalled();
    expect(commentSetService.renderCommentsOnPage).toHaveBeenCalled();
  });

  it('should add annotationSet to page', () => {
    spyOn(annoSetService, 'addAnnoSetToPage');

    service.addAnnoSetToPage();

    expect(annoSetService.addAnnoSetToPage).toHaveBeenCalled();
  });

  it('should build annotationSet components', () => {
    const annotationSet = {} as AnnotationSet;
    spyOn(annoSetService, 'destroyComponents');
    spyOn(commentSetService, 'destroyComponents');
    spyOn(annoSetService, 'setAnnotationSet');
    spyOn(commentSetService, 'setAnnotationSet');

    service.buildAnnoSetComponents(annotationSet);

    expect(service.annotationSet).toBe(annotationSet);
    expect(annoSetService.destroyComponents).toHaveBeenCalled();
    expect(commentSetService.destroyComponents).toHaveBeenCalled();
    expect(annoSetService.setAnnotationSet).toHaveBeenCalledWith(annotationSet);
    expect(commentSetService.setAnnotationSet).toHaveBeenCalledWith(annotationSet);
  });

  it('should add comments to rendered pages', function () {
    spyOn(commentSetService, 'addCommentsToRenderedPages');

    service.addCommentsToRenderedPages();

    expect(commentSetService.addCommentsToRenderedPages).toHaveBeenCalled();
  });

  it('should destroy commentSets HTML', function () {
    spyOn(commentSetService, 'destroyCommentSetsHTML');

    service.destroyCommentSetsHTML();

    expect(commentSetService.destroyCommentSetsHTML).toHaveBeenCalled();
  });
});
