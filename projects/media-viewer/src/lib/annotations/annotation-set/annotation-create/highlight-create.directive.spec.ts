import { ElementRef } from '@angular/core';
import { HighlightCreateDirective } from './highlight-create.directive';
import { SelectedAnnotation } from '../../../store/actions/annotations.action';
import { BehaviorSubject, of } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';
import any = jasmine.any;

describe('HighlightCreateDirective', () => {

  let directive: HighlightCreateDirective;
  const toolbarEvents = { highlightModeSubject: new BehaviorSubject(false) } as any;
  const viewerEvents = { textSelected: () => {}, clearCtxToolbar: () => {} } as any;
  const highlightService = { applyRotation: () => {} } as any;
  const store = { dispatch: () => {}, select: () => of([{}])  } as any;
  const hostElement = document.createElement('div');
  hostElement.scrollLeft = 20;
  hostElement.scrollTop = 30;
  const event = { clientX: 50, clientY: 40, preventDefault: () => {} };
  const mouseEvent = { target: { offsetParent: { offsetParent: { getAttribute: () => 1 }} } } as any;
  const page = {
    scaleRotation: { rotation: 0, scale: 1 },
    styles: { height: 1122, left: 341, width: 793 }
  };

  beforeEach(() => {
    directive = new HighlightCreateDirective(new ElementRef<HTMLElement>(hostElement),
      toolbarEvents, viewerEvents, highlightService, store);
  });

  it('should not highlight text when in view mode for selected page', () => {
    spyOn(toolbarEvents.highlightModeSubject, 'getValue').and.returnValue(false);
    spyOn(viewerEvents, 'textSelected');

    directive.onMouseUp(mouseEvent);

    expect(viewerEvents.textSelected).not.toHaveBeenCalled();
  });

  it('should deselect annotation and context toolbar', () => {
    spyOn(store, 'dispatch');
    spyOn(viewerEvents, 'clearCtxToolbar');

    directive.onPdfViewerClick(event as any);

    expect(store.dispatch).toHaveBeenCalledWith(new SelectedAnnotation({
      annotationId: '', selected: false, editable: false
    }));
    expect(viewerEvents.clearCtxToolbar).toHaveBeenCalled();
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
    spyOn(toolbarEvents.highlightModeSubject, 'getValue').and.returnValue(true);
    spyOn(window, 'getSelection').and.returnValue(mockSelection);

    const mockElement = getMockElement('');
    const mockEvent = { target: { ...mouseEvent.target, parentElement: mockElement } } as any;
    directive.zoom = 1;
    directive.allPages = { '1': { ...page } };
    spyOn(viewerEvents, 'textSelected');
    const rectangle = { x: 20, y: 50, height: 20, width: 10 };
    spyOn(highlightService, 'applyRotation').and.returnValue(rectangle);
    const id = any(String) as any;
    const { height, width } = page.styles;
    directive.zoom = 0.5;

    directive.onMouseUp(mockEvent);

    expect(highlightService.applyRotation).toHaveBeenCalledWith(height, width, 20, 10, 50, 20, 0, 1);
    expect(viewerEvents.textSelected)
      .toHaveBeenCalledWith({ page: 1 , rectangles: [{ id, ...rectangle }]});
  }));

  it('should remove extra padding and transform', () => {
    spyOn(toolbarEvents.highlightModeSubject, 'getValue').and.returnValue(true);
    spyOn(window, 'getSelection').and.returnValue({} as any);

    const mockElement = getMockElement('scaleX(0.969918) translateX(-110.684px)');
    const mockEvent = { target: { ...mouseEvent.target, parentElement: mockElement } } as any;
    directive.allPages = { '1': { ...page }};

    directive.onMouseUp(mockEvent);

    expect(mockElement.children[0].style.padding).toBe('0');
    expect(mockElement.children[0].style.transform).not.toContain('translate');
  });

  it('should remove extra padding and transform with just only translate', () => {
    spyOn(toolbarEvents.highlightModeSubject, 'getValue').and.returnValue(true);
    spyOn(window, 'getSelection').and.returnValue({} as any);

    const mockElement = getMockElement('translateX(-110.684px) translateY(12px)');
    const mockEvent = { target: { ...mouseEvent.target, parentElement: mockElement } } as any;
    directive.allPages = { '1': { ...page }};

    directive.onMouseUp(mockEvent);

    expect(mockElement.children[0].style.padding).toBe('0');
    expect(mockElement.children[0].style.transform).not.toContain('translateX');
  });

  const getMockElement = (transform: string) => {
    return {
        getBoundingClientRect: () => ({ top: 30, left: 40}),
        children: [{ style: { padding: '20', transform: transform }}]
    };
  };
});
