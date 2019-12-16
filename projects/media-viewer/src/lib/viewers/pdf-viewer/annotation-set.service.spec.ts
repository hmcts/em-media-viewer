import { ComponentFactory, ElementRef } from '@angular/core';
import { PageEvent, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { AnnotationSetService } from './annotation-set.service';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { AnnotationSetComponent } from '../../annotations/annotation-set/annotation-set.component';

describe('AnnotationSetService', () => {

  let service: AnnotationSetService;
  const mockFactoryResolver  = { resolveComponentFactory: () => {}} as any;
  const mockContainerRef = { createComponent: () => {}} as any;

  beforeEach(() => {
    service = new AnnotationSetService(mockFactoryResolver, mockContainerRef);
  });

  it('should init viewer and wrapper', () => {
    const mockWrapper = {} as PdfJsWrapper;
    const mockViewer = {} as ElementRef;

    service.init(mockWrapper, mockViewer);

    expect(service.pdfWrapper).toBe(mockWrapper);
    expect(service.pdfViewer).toBe(mockViewer);
  });

  it('should set annotationSet', () => {
    const annotationSet = {} as AnnotationSet;

    service.setAnnotationSet(annotationSet);

    expect(service.annotationSet).toBe(annotationSet);
  });

  it('should add annotations to page', () => {
    const annoSetComp1 = { instance: { page: 1, addToDOM: () => {} }} as any;
    const annoSetComp2 = { instance: { page: 2, addToDOM: () => {}  }} as any;
    service.annotationSetComponents = [annoSetComp1, annoSetComp2];
    const pageRenderEvent = { pageNumber: 1 } as PageEvent;
    spyOn(annoSetComp1.instance, 'addToDOM');

    service.addAnnotationsToPage(pageRenderEvent);

    expect(annoSetComp1.instance.addToDOM).toHaveBeenCalled();
  });

  it('should add annotationSet to page', () => {
    service.pdfViewer = { nativeElement: { querySelector: () => null }} as any;
    const mockAnnoSetComp = mockAnnotationSetCreation();
    spyOn(mockAnnoSetComp.instance, 'addToDOM');

    service.addAnnoSetToPage();

    expect(mockFactoryResolver.resolveComponentFactory).toHaveBeenCalled();
    expect(mockContainerRef.createComponent).toHaveBeenCalled();
    expect(mockAnnoSetComp.instance.addToDOM).toHaveBeenCalledWith({ rotation: 90, scale: 0.2, div: null });
  });

  it('should build annotationSet components', () => {
    const mockAnnoSetComp = mockAnnotationSetCreation();
    spyOn(mockAnnoSetComp.instance, 'addToDOM');

    service.buildAnnoSetComponents();

    expect(mockFactoryResolver.resolveComponentFactory).toHaveBeenCalled();
    expect(mockContainerRef.createComponent).toHaveBeenCalled();
    expect(service.pages).toContain(1, 2);
    expect(service.annotationSetComponents).toContain(mockAnnoSetComp);
  });

  it('should destroy commentSets HTML', () => {
    const annoSetComp = { destroy: () => {} } as any;
    service.annotationSetComponents = [annoSetComp];
    service.pages = [1, 2, 4];
    spyOn(annoSetComp, 'destroy');

    service.destroyComponents();

    expect(annoSetComp.destroy).toHaveBeenCalled();
    expect(service.annotationSetComponents.length).toBe(0);
    expect(service.pages.length).toBe(0);
  });

  function mockAnnotationSetCreation(): any {
    service.annotationSet = { annotations: [{ page: 1 }, { page: 2 }]} as AnnotationSet;
    service.pdfWrapper = {
      getPageNumber: () => 1,
      getNormalisedPagesRotation: () => 90,
      getCurrentPDFZoomValue: () => 0.2
    } as PdfJsWrapper;
    const mockFactory = {} as ComponentFactory<AnnotationSetComponent>;
    spyOn(mockFactoryResolver, 'resolveComponentFactory').and.returnValue(mockFactory);
    const mockAnnoSetComp = { instance: { addToDOM: () => {}}} as any;
    spyOn(mockContainerRef, 'createComponent').and.returnValue(mockAnnoSetComp);
    return mockAnnoSetComp;
  }
});
