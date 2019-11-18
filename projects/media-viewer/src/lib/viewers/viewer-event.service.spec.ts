import {ViewerEventService} from './viewer-event.service';

describe('Viewer Events Service', () => {
  let service: ViewerEventService;

  const mockHighLight: any = {
    page : 2
  };

  beforeEach(() => {
    service = new ViewerEventService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should select the text', () => {
    const textSelectSpy = spyOn(service.highlightedText, 'next');
    service.onTextSelection(mockHighLight);

    expect(textSelectSpy).toHaveBeenCalledTimes(1);
  });

  it('should select the Shape', () => {
    const shapeSelectSpy = spyOn(service.highlightedShape, 'next');
    service.onShapeSelection(mockHighLight);

    expect(shapeSelectSpy).toHaveBeenCalledTimes(1);
  });

  it('should toggle comments panel', () => {
    const commentsToggleSpy = spyOn(service.commentsPanelToggle, 'next');
    service.toggleCommentsPanel(false);

    expect(commentsToggleSpy).toHaveBeenCalledWith(false);
  });

});
