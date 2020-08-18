import { HighlightCreateService } from './highlight-create.service';
import { of } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';

describe('HighlightCreateService', () => {

  const mockHighlightModeSubject = { next: () => {} };
  const toolbarEvents = { highlightModeSubject: mockHighlightModeSubject } as any;
  let saveAnnoAction: any;
  const mockStore = {
    select: () => of({
      styles: { height: 100, width: 100 },
      scaleRotation: { scale: 1, rotation: 0 }
    }),
    dispatch: (action) => { saveAnnoAction = action },
    pipe: () => of({ annotationSetId: 'annotationSetId', documentId: 'documentId' })
  } as any;

  let service: HighlightCreateService;

  beforeEach(() => {
    service = new HighlightCreateService(toolbarEvents, mockStore);
  });


  it('should save annotation', () => {
    const mockRectangles = ['rectangles'] as any;
    spyOn(mockStore, 'dispatch').and.callThrough();

    service.saveAnnotation(mockRectangles,1);

    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(saveAnnoAction.payload.page).toBe(1);
    expect(saveAnnoAction.payload.rectangles).toBe(mockRectangles);
    expect(saveAnnoAction.payload.documentId).toBe('documentId');
    expect(saveAnnoAction.payload.annotationSetId).toBe('annotationSetId');
  });

  it('should reset highlight', () => {
    spyOn(window.getSelection(), 'removeAllRanges');
    spyOn(toolbarEvents.highlightModeSubject, 'next');

    service.resetHighlight();

    expect(window.getSelection().removeAllRanges).toHaveBeenCalled();
    expect(toolbarEvents.highlightModeSubject.next).toHaveBeenCalledWith(false);
  });
});
