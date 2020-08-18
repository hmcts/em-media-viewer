import { ElementRef } from '@angular/core';
import { HighlightCreateDirective } from './highlight-create.directive';
import { SelectedAnnotation } from '../../../store/actions/annotations.action';
import { BehaviorSubject, of } from 'rxjs';

describe('HighlightCreateDirective', () => {

  let directive: HighlightCreateDirective;
  const toolbarEvents = { highlightModeSubject: new BehaviorSubject(false) } as any;
  const viewerEvents = { textSelected: () => {}, clearCtxToolbar: () => {} } as any;
  const highlightService = {} as any;
  const store = { dispatch: () => {}, select: () => of([{}])  } as any;
  const hostElement = document.createElement('div');
  hostElement.scrollLeft = 20;
  hostElement.scrollTop = 30;
  const event = { clientX: 50, clientY: 40, preventDefault: () => {} }

  beforeEach(() => {
    directive = new HighlightCreateDirective(new ElementRef<HTMLElement>(hostElement),
      toolbarEvents, viewerEvents, highlightService, store);
  });

  it('should not highlight text when in view mode for selected page', () => {
    const mouseEvent = { target: { offsetParent: { offsetParent: { getAttribute: () => 1 }} } } as any;
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
    expect(viewerEvents.clearCtxToolbar).toHaveBeenCalled()
  });

});
