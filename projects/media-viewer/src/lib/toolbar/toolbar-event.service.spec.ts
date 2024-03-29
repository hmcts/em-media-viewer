import { ToolbarEventService } from './toolbar-event.service';

describe('Toolbar Event Service', () => {
  let service: ToolbarEventService;
  beforeEach(() => {
    service = new ToolbarEventService();
    service.drawModeSubject.next(false);
    service.highlightModeSubject.next(false);
  });
  afterEach(() => {
    service = null;
  });
  it('should create', () => {
    expect(service).toBeTruthy();
  });
  it('should turn off drawMode if HighlightMode is toggled on', () => {
    service.highlightModeSubject.next(false);
    service.drawModeSubject.next(true);
    service.toggleHighlightMode();
    expect(service.drawModeSubject.getValue()).toBeFalsy();
  });
  it('should turn off drawMode if drawMode is toggled off', () => {
    service.drawModeSubject.next(true);
    service.toggleDrawMode();
    expect(service.drawModeSubject.getValue()).toBeFalsy();
  });
  it('should turn off HighlightMode if HighlightMode is toggled off', () => {
    service.highlightModeSubject.next(true);
    service.toggleHighlightMode();
    expect(service.highlightModeSubject.getValue()).toBeFalsy();
  });
  it('should turn off highlightMode if drawModel is toggled on', () => {
    service.highlightModeSubject.next(true);
    service.drawModeSubject.next(false);
    service.toggleDrawMode();
    expect(service.highlightModeSubject.getValue()).toBeFalsy();
    expect(service.grabNDrag.getValue()).toBeFalsy();
  });

  it('should set toggleCommentsSummary to true if comment summary is toggled off', () => {
    service.showCommentSummary.next(false);
    service.toggleCommentsSummary(true);
    expect(service.showCommentSummary.getValue()).toBeTruthy();
  });

  it('should set toggleCommentsSummary to false if comment summary is toggled on', () => {
    service.showCommentSummary.next(true);
    service.toggleCommentsSummary(false);
    expect(service.showCommentSummary.getValue()).toBeFalsy();
  });

  it('should reset', () => {
    service.zoomValueSubject.next(2);
    service.drawModeSubject.next(true);
    service.reset();
    expect(service.zoomValueSubject.getValue()).toBe(1);
    expect(service.drawModeSubject.getValue()).toBeFalsy();
    expect(service.grabNDrag.getValue()).toBeFalsy();
  });

  it('should toggle comments panel', () => {
    const commentsToggleSpy = spyOn(service.commentsPanelVisible, 'next');
    service.toggleCommentsPanel(false);

    expect(commentsToggleSpy).toHaveBeenCalledWith(false);
  });

  it('should hide comments panel when participants list shows', () => {
    const commentsToggleSpy = spyOn(service.commentsPanelVisible, 'next');
    service.toggleParticipantsList(true);

    expect(commentsToggleSpy).toHaveBeenCalledWith(false);
  });

  it('should hide participants list when comments panel shows', () => {
    const commentsToggleSpy = spyOn(service.icp.participantsListVisible, 'next');
    service.toggleCommentsPanel(true);

    expect(commentsToggleSpy).toHaveBeenCalledWith(false);
  });

  it('should toggle redaction mode off', () => {
    service.redactionMode.next(false);
    service.toggleRedactionMode();
    expect(service.drawModeSubject.getValue()).toBeFalsy();
    expect(service.grabNDrag.getValue()).toBeFalsy();
    expect(service.redactionMode.getValue()).toBeTruthy();
  });

  it('should toggle redaction mode on', () => {
    service.redactionMode.next(true);
    service.toggleRedactionMode();
    expect(service.redactionMode.getValue()).toBeFalsy();
  });

});
