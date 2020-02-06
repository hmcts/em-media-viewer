import { TextHighlightCreateService } from './text-highlight-create.service';
import { AnnotationSet } from '../annotation-set.model';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';


describe('TextHighlightCreateService', () => {

  const mockHighlightModeSubject = { next: () => {} };
  const toolbarEvents = { highlightModeSubject: mockHighlightModeSubject } as any;
  const annotationApi = { postAnnotation: () => {}} as any;
  const annotationEvents = { selectAnnotation: () => {}} as any;


  let service: TextHighlightCreateService;

  beforeEach(() => {
    service = new TextHighlightCreateService(toolbarEvents, annotationApi, annotationEvents);
  });

  it('should create text highlight', fakeAsync(() => {
    const mockClientRects = [{ top: 100, bottom: 80, right: 70, left: 60 }] as any;
    const mockRange = { getClientRects: () => mockClientRects } as any;
    const mockSelection = {
      rangeCount: 1,
      isCollapsed: false,
      getRangeAt: () => ({ cloneRange: () => mockRange }),
      removeAllRanges: () => {}
    } as any;
    spyOn(window, 'getSelection').and.returnValue(mockSelection);

    const mockElement = {
      parentElement: ({ getBoundingClientRect: () => ({ top: 30, left: 40})})
    };
    const mockHighlight = { event: { target: mockElement }} as any;
    const mockAnnoSet = { annotations: []} as AnnotationSet;
    const mockPageInfo = { zoom: 1, rotate: 0, pageHeight: 1000, pageWidth: 800};

    spyOn(annotationApi, 'postAnnotation').and.returnValue(of({ id: 'annoId' }));
    spyOn(annotationEvents, 'selectAnnotation');
    spyOn(mockHighlightModeSubject, 'next');

    service.createTextHighlight(mockHighlight, mockAnnoSet, mockPageInfo);
    tick();

    expect(annotationApi.postAnnotation).toHaveBeenCalled();
    expect(annotationEvents.selectAnnotation).toHaveBeenCalledWith({ annotationId: 'annoId', editable: false });
    expect(mockHighlightModeSubject.next).toHaveBeenCalledWith(false);
  }));

  it('should remove extra padding and transform', () => {
    spyOn(window, 'getSelection').and.returnValue({} as any);

    const mockElement = {
      parentElement: ({
        getBoundingClientRect: () => ({ top: 30, left: 40}),
        childNodes: [{ style: { padding: 20, transform: 'scaleX(0.969918) translateX(-110.684px)' }}]
      })
    };
    const mockHighlight = { event: { target: mockElement }} as any;

    service.createTextHighlight(mockHighlight, {}, {});

    expect(mockElement.parentElement.childNodes[0].style.padding).toBe(0);
    expect(mockElement.parentElement.childNodes[0].style.transform).not.toContain('translate');
  });

  it('should remove extra padding and transform with just only translate', () => {
    spyOn(window, 'getSelection').and.returnValue({} as any);

    const mockElement = {
      parentElement: ({
        getBoundingClientRect: () => ({ top: 30, left: 40}),
        childNodes: [{ style: { padding: 20, transform: 'translateX(-110.684px) translateY(12px)' }}]
      })
    };
    const mockHighlight = { event: { target: mockElement }} as any;

    service.createTextHighlight(mockHighlight, {}, {});

    expect(mockElement.parentElement.childNodes[0].style.padding).toBe(0);
    expect(mockElement.parentElement.childNodes[0].style.transform).not.toContain('translateX');
  });
});
