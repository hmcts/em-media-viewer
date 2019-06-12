import { AppPage } from './pages/app.po';
import { browser } from 'protractor';

describe('media viewer app', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await page.preparePage();
  });

  // afterEach(async () => {
  //   console.log('app e2e after each method not being overriden');
  //   // browser.restart();
  // });


  it('should display header', async () => {
    expect(page.getHeaderText()).toEqual('Media Viewer Demo');
  });
});
