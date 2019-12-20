import { AppPage } from './pages/app.po';

describe('media viewer app', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await page.preparePage();
  });


  it('should display header', async () => {
    const headerText = await page.getHeaderText();
    expect(headerText).toEqual('Media Viewer Demo');
  });
});
