import { HighlightCreateService } from './highlight-create.service';
import { of } from 'rxjs';

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

  it('should apply no rotation', () => {
    const rectangle = service
      .applyRotation(500, 400, 200, 150, 75, 80, 0, 1);

    expect(rectangle).toEqual({ x: 80, y: 75, width: 150, height: 200 });
  });

  it('should apply 90 degree rotation', () => {
    const rectangle = service
      .applyRotation(500, 400, 200, 150, 75, 80, 90, 1);

    expect(rectangle).toEqual({ x: 75, y: 170, width: 200, height: 150 });
  });

  it('should apply 180 degree rotation', () => {
    const rectangle = service
      .applyRotation(500, 400, 200, 150, 75, 80, 180, 1);

    expect(rectangle).toEqual({ x: 170, y: 225, width: 150, height: 200 });
  });

  it('should apply 270 degree rotation', () => {
    const rectangle = service
      .applyRotation(500, 400, 200, 150, 75, 80, 270, 1);

    expect(rectangle).toEqual({ x: 225, y: 80, width: 200, height: 150 });
  });

  it('should reset highlight', () => {
    spyOn(window.getSelection(), 'removeAllRanges');
    spyOn(toolbarEvents.highlightModeSubject, 'next');

    service.resetHighlight();

    expect(window.getSelection().removeAllRanges).toHaveBeenCalled();
    expect(toolbarEvents.highlightModeSubject.next).toHaveBeenCalledWith(false);
  });
});
