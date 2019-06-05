import { AppPage } from './pages/app.po';

describe('media viewer app', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should display header', () => {
    page.navigateTo();

    expect(page.getHeaderText()).toEqual('Media Viewer Demo');
  });
});
