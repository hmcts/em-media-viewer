import { HighlightCreateService } from './highlight-create.service';
import { of } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';


describe('HighlightCreateService', () => {

  const mockHighlightModeSubject = { next: () => {} };
  const toolbarEvents = { highlightModeSubject: mockHighlightModeSubject } as any;
  const annotationApi = { postAnnotation: () => {}} as any;
  const mockStore = {
    select: () => of({
      styles: { height: 100, width: 100 },
      scaleRotation: { scale: 1, rotation: 1 }
    }),
    dispatch: () => {},
    pipe: () => of({ annotationSetId: 'annotationSetId', documentId: 'documentId' })
  } as any;

  let service: HighlightCreateService;

  beforeEach(() => {
    service = new HighlightCreateService(toolbarEvents, annotationApi, mockStore);
  });

  it('should set the style values from the store', function () {

  });

  it('should create rectangles', fakeAsync(() => {
    const mockClientRects = [{ top: 80, left: 60 , bottom: 100, right: 70 }] as any;
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
    service.zoom = 1;

    const rectangles = service.getRectangles(mockHighlight);

    expect(rectangles[0].x).toBe(20);
    expect(rectangles[0].y).toBe(50);
    expect(rectangles[0].height).toBe(20);
    expect(rectangles[0].width).toBe(10);
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

    service.getRectangles(mockHighlight);

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

    service.getRectangles(mockHighlight);

    expect(mockElement.parentElement.childNodes[0].style.padding).toBe(0);
    expect(mockElement.parentElement.childNodes[0].style.transform).not.toContain('translateX');
  });

  it('should save annotation', function () {

  });

  it('should reset highlight', function () {

  });
});
