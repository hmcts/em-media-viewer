import { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';

describe('Toolbar Button Visibility Service', () => {
  let service: ToolbarButtonVisibilityService;
  beforeEach(() => {
    service = new ToolbarButtonVisibilityService();
  });

  it('setup with values', () => {
    const newValues = {
      showPrint: true,
      showDownload: true
    };

    service.setup(newValues);

    expect(service.showPrint).toBeTruthy();
    expect(service.showDownload).toBeTruthy();
  });

  it('unset other options', () => {
    const oldValues = {
      showPrint: true,
      showDownload: true
    };

    service.setup(oldValues);

    const newValues = {
      showBookmark: true
    };

    service.setup(newValues);

    expect(service.showPrint).toBeFalsy();
    expect(service.showDownload).toBeFalsy();
  });

});
