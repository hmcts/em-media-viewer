import { PdfAnnotationService } from './pdf-annotation.service';
import { CommentSetService } from './comment-set.service';
import { ComponentFactory, ElementRef } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewer-event.service';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { PageEvent } from './pdf-js/pdf-js-wrapper';
import { CommentSetComponent } from '../../annotations/comment-set/comment-set.component';

describe('PdfAnnotationService', () => {

  const mockFactoryResolver = { resolveComponentFactory: () => {}} as any;
  const mockContainerRef = { createComponent: () => {}} as any;
  const mockToolbarEvents = {} as ToolbarEventService;
  const mockViewerEvents = {} as ViewerEventService;
  const mockCommentService = { updateCommentSets: () => {}} as any;
  let service: CommentSetService;

  beforeEach(() => {
    service = new CommentSetService(
      mockFactoryResolver,
      mockContainerRef,
      mockToolbarEvents,
      mockViewerEvents,
      mockCommentService
    );
  });

  it('should init viewer', () => {
    const viewer = {} as ElementRef;

    service.init(viewer);

    expect(service.pdfViewer).toBe(viewer);
  });

  it('should set annotation set', () => {
    const annotationSet = {} as AnnotationSet;

    service.setAnnotationSet(annotationSet);

    expect(service.annotationSet).toBe(annotationSet);
  });

  it('should add commentSet to page', () => {
    const commentSetComp = { instance: { page: 1}} as any;
    const pageEvent = {} as PageEvent;
    service.commentSetComponents = [commentSetComp];
    const mockCommentSet = mockCommentSetCreation();
    spyOn(mockCommentSet.instance, 'addToDOM');
    spyOn(mockCommentService, 'updateCommentSets');

    service.renderCommentsOnPage(pageEvent);

    expect(mockCommentSet.instance.addToDOM).toHaveBeenCalled();
    expect(mockCommentService.updateCommentSets).toHaveBeenCalled();
  });

  it('should render comments on page', () => {
    const commentSetComp = { instance: { page: 1, updateView: () => {} }} as any;
    const pageEvent = { pageNumber: 1 } as PageEvent;
    service.commentSetComponents = [commentSetComp];
    spyOn(commentSetComp.instance, 'updateView');

    service.renderCommentsOnPage(pageEvent);

    expect(commentSetComp.instance.updateView).toHaveBeenCalledWith(pageEvent);
  });

  it('should add comments to rendered pages', () => {
    const [, page] = mockDestroyCommentSetsHtml();
    spyOn(page, 'closest').and.returnValue(undefined);
    page.getElementsByClassName = () => ({ length: 1 });
    page.getAttribute = () => {};
    const mockCommentSet = mockCommentSetCreation();
    spyOn(mockCommentSet.instance, 'addToDOM');
    spyOn(mockCommentService, 'updateCommentSets');

    service.addCommentsToRenderedPages();

    expect(mockCommentSet.instance.addToDOM).toHaveBeenCalled();
    expect(mockCommentService.updateCommentSets).toHaveBeenCalled();
  });

  it('should destroy components', () => {
    const commentSetComp = { destroy: () => {} } as any;
    service.commentSetComponents = [commentSetComp];
    spyOn(commentSetComp, 'destroy');

    service.destroyComponents();

    expect(commentSetComp.destroy).toHaveBeenCalled();
    expect(service.commentSetComponents.length).toBe(0);
  });

  it('should destroy commentSets HTML', () => {
    const [container, page] = mockDestroyCommentSetsHtml();
    spyOn(page, 'closest').and.returnValue(container);

    service.destroyCommentSetsHTML();

    expect(container.insertAdjacentElement).toHaveBeenCalledWith('beforebegin', page);
    expect(container.remove).toHaveBeenCalled();
  });

  function mockCommentSetCreation(): any {
    service.annotationSet = { annotations: [{ page: 1 }, { page: 2 }]} as AnnotationSet;
    const mockFactory = {} as ComponentFactory<CommentSetComponent>;
    spyOn(mockFactoryResolver, 'resolveComponentFactory').and.returnValue(mockFactory);
    const mockCommentSetComp = { instance: { addToDOM: () => {}, updateView: () => {}}} as any;
    spyOn(mockContainerRef, 'createComponent').and.returnValue(mockCommentSetComp);
    return mockCommentSetComp;
  }

  function mockDestroyCommentSetsHtml() {
    const page = { closest: () => {}} as any;
    service.pdfViewer = { nativeElement: { querySelectorAll: () => [page]}} as any;
    const container = { insertAdjacentElement: () => {}, remove: () => {}} as any;
    spyOnAllFunctions(container);
    return [container, page];
  }

});
