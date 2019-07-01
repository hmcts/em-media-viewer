import {ToolbarEventService} from './toolbar-event.service';

describe('Toolbar Event Service', () => {
  let service: ToolbarEventService;
  beforeEach(() => {
    service = new ToolbarEventService();
    service.drawMode.next(false);
    service.highlightMode.next(false);
  });
  afterEach(() => {
    service = null;
  });
  it('should create', () => {
      expect(service).toBeTruthy();
  });
  it('should turn off drawMode if HighlightMode is toggled on', () => {
      service.highlightMode.next(false);
      service.drawMode.next(true);
      service.toggleHighlightMode();
      expect(service.drawMode.getValue()).toBeFalsy();
  });
  it('should turn off drawMode if drawMode is toggled off', () => {
    service.drawMode.next(true);
    service.toggleDrawMode();
    expect(service.drawMode.getValue()).toBeFalsy();
  });
  it('should turn off HighlightMode if HighlightMode is toggled off', () => {
    service.highlightMode.next(true);
    service.toggleHighlightMode();
    expect(service.highlightMode.getValue()).toBeFalsy();
  });
  it('should turn off highlightMode is drawModel is toggled on', () => {
    service.highlightMode.next(true);
    service.drawMode.next(false);
    service.toggleDrawMode();
    expect(service.highlightMode.getValue()).toBeFalsy();
  });
});
