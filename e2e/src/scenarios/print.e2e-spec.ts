import { browser } from 'protractor';
import { PrintDownloadPage } from '../pages/print-download.po';

describe('print', () => {
  let page: PrintDownloadPage;

  beforeEach(() => {
    page = new PrintDownloadPage();
  });

  afterEach(async () => {
    browser.close();
    const tabs = await browser.getAllWindowHandles();
    browser.switchTo().window(tabs[0]);
  });


  it('should print the pdf', async () => {
    page.selectPdfViewer();
    page.clickPrint();

    await page.swithToPrintTab();

    expect(page.getPrintDialog()).toBeDefined();
  });

  it('should print the image', async () => {
    page.selectImageViewer();
    page.clickPrint();

    await page.swithToPrintTab();

    expect(page.getPrintDialog()).toBeDefined();
  });
});
