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
    page.selectPdfViewer();
    await page.clickPrint();

    await page.switchToPrintTab();

    expect(page.getPrintDialog()).toBeDefined();
  });

  it('should print the image', async () => {
    page.selectImageViewer();
    await page.clickPrint();

    await page.switchToPrintTab();

    expect(page.getPrintDialog()).toBeDefined();
  });
});
