import { AppPage } from '../app.po';
import { browser } from 'protractor';

describe('print', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should print the pdf', async () => {
    page.getPdfViewer().click();
    page.getPrintButton().click();

    const tabs = await page.getBrowserTabs();

    expect(tabs.length).toEqual(2);

    browser.switchTo().window(tabs[1]);
    expect(page.getPrintDialog).toBeTruthy();

    page.wait(1000);
    browser.close();
    browser.switchTo().window(tabs[0]);
  });

  it('should print the image', async () => {
    page.getImageViewer().click();
    page.getPrintButton().click();

    const tabs = await page.getBrowserTabs();

    expect(tabs.length).toEqual(2);

    browser.switchTo().window(tabs[1]);
    expect(page.getPrintDialog).toBeTruthy();

    page.wait(1000);
    browser.close();
    browser.switchTo().window(tabs[0]);
  });
});
