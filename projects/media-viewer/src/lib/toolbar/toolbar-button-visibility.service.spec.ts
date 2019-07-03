import { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';

describe('Toolbar Button Visibility Service', () => {
  let service: ToolbarButtonVisibilityService;
  beforeEach(() => {
    service = new ToolbarButtonVisibilityService();
  });

  it('reset with values', () => {
    service.searchBarHidden.next(false);
    const newValues = {
      showPrint: true,
      showDownload: true
    };

    service.reset(newValues);

    expect(service.showPrint).toBeTruthy();
    expect(service.showDownload).toBeTruthy();
    expect(service.searchBarHidden.value).toBeTruthy();
  });

  it('unset other options', () => {
    const oldValues = {
      showPrint: true,
      showDownload: true
    };

    service.reset(oldValues);

    const newValues = {
      showBookmark: true
    };

    service.reset(newValues);

    expect(service.showPrint).toBeFalsy();
    expect(service.showDownload).toBeFalsy();
  });

});
