import { ToolbarEventService } from './toolbar-event.service';
import { IcpEventService } from './icp-event.service';


  describe('Toolbar Event Service', () => {
    let service: ToolbarEventService;
    let icpEventService: IcpEventService;

    beforeEach(() => {
      icpEventService = new IcpEventService();
      service = new ToolbarEventService(icpEventService);
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

    it('should turn off highlightMode if drawMode is toggled on', () => {
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
      const commentsToggleSpy = spyOn(icpEventService.participantsListVisible, 'next');
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

    it('should toggle grab and drag mode', () => {
      service.grabNDrag.next(false);
      service.toggleGrabNDrag();
      expect(service.grabNDrag.getValue()).toBeTruthy();
      service.toggleGrabNDrag();
      expect(service.grabNDrag.getValue()).toBeFalsy();
    });

    it('should toggle sidebar', () => {
      service.sidebarOpen.next(false);
      service.toggleSideBar(true);
      expect(service.sidebarOpen.getValue()).toBeTruthy();
      service.toggleSideBar(false);
      expect(service.sidebarOpen.getValue()).toBeFalsy();
    });

    it('should toggle sidebar view', () => {
      service.sidebarOutlineView.next(true);
      service.toggleSideBarView(false);
      expect(service.sidebarOutlineView.getValue()).toBeFalsy();
      service.toggleSideBarView(true);
      expect(service.sidebarOutlineView.getValue()).toBeTruthy();
    });

    it('should toggle highlight toolbar', () => {
      service.highlightToolbarSubject.next(false);
      service.toggleHighlightToolbar();
      expect(service.highlightToolbarSubject.getValue()).toBeTruthy();
      service.toggleHighlightToolbar();
      expect(service.highlightToolbarSubject.getValue()).toBeFalsy();
    });

    it('should rotate', () => {
      const rotateSpy = spyOn(service.rotateSubject, 'next');
      service.rotate(90);
      expect(rotateSpy).toHaveBeenCalledWith(90);
    });

    it('should search', () => {
      const searchSpy = spyOn(service.searchSubject, 'next');
      const searchOperation = {
        searchTerm: 'test',
        highlightAll: true,
        matchCase: false,
        wholeWord: false,
        previous: false,
        reset: false,
      };
      service.search(searchOperation);
      expect(searchSpy).toHaveBeenCalledWith(searchOperation);
    });

    it('should step zoom', () => {
      const stepZoomSpy = spyOn(service.stepZoomSubject, 'next');
      service.stepZoom(1);
      expect(stepZoomSpy).toHaveBeenCalledWith(1);
    });

    it('should set page', () => {
      const setPageSpy = spyOn(service.setCurrentPageSubject, 'next');
      service.setPage(2);
      expect(setPageSpy).toHaveBeenCalledWith(2);
    });

    it('should increment page', () => {
      const incrementPageSpy = spyOn(service.changePageByDeltaSubject, 'next');
      service.incrementPage(1);
      expect(incrementPageSpy).toHaveBeenCalledWith(1);
    });

    it('should save rotation', () => {
      const saveRotationSpy = spyOn(service.saveRotationSubject, 'next');
      service.saveRotation();
      expect(saveRotationSpy).toHaveBeenCalled();
    });

    it('should apply redaction to document', () => {
      const applyRedactionSpy = spyOn(service.applyRedactToDocument, 'next');
      service.applyRedactionToDocument();
      expect(applyRedactionSpy).toHaveBeenCalled();
    });

    it('should redact page', () => {
      const redactPageSpy = spyOn(service.redactWholePage, 'next');
      service.redactPage();
      expect(redactPageSpy).toHaveBeenCalled();
    });

    it('should unmark all redactions', () => {
      const unmarkAllSpy = spyOn(service.clearAllRedactMarkers, 'next');
      service.unmarkAll();
      expect(unmarkAllSpy).toHaveBeenCalled();
    });

    it('should toggle redaction preview', () => {
      const redactionPreviewSpy = spyOn(service.redactionPreview, 'next');
      service.toggleRedactionPreview(true);
      expect(redactionPreviewSpy).toHaveBeenCalledWith(true);
    });
  });
