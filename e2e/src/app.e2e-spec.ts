import { AppPage } from './pages/app.po';
import { browser } from 'protractor';

describe('media viewer app', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  // afterEach(async () => {
  //   console.log('app e2e after each method not being overriden');
  //   // browser.restart();
  // });


  it('should display header', async () => {
    await page.navigateTo();

    expect(page.getHeaderText()).toEqual('Media Viewer Demo');
  });
});
