import { browser } from 'protractor';
import { PrintPage } from '../pages/print.po';

describe('print', () => {
  let page: PrintPage;

  beforeEach(async () => {
    page = new PrintPage();
    await page.preparePage();
  });

  afterEach(async () => {
    browser.close();
    const tabs = await browser.getAllWindowHandles();
    browser.switchTo().window(tabs[0]);
  });

  it('should print the pdf', async () => {
    await page.selectPdfViewer();
    await page.showToolbarButtons();
    await page.clickPrint();

    await page.switchToPrintTab();

    expect(await page.getPrintDialog()).toBeDefined();
  });

  it('should print the image', async () => {
    await page.selectImageViewer();
    await page.showToolbarButtons();
    await page.clickPrint();

    await page.switchToPrintTab();

    expect(await page.getPrintDialog()).toBeDefined();
  });
});
