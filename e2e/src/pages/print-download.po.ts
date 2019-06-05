import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';
const fs = require('fs');

export class PrintDownloadPage extends AppPage {

  clickDownload() {
    return element(by.id('download')).click();
  }

  clickPrint() {
    return element(by.id('print')).click();
  }

  getPrintDialog() {
    return element(by.css('print-preview-app'));
  }

  async hasFileDownloaded(filePath) {
    await browser.wait(async () => fs.existsSync(filePath), 3000, 'File failed to download');
    return fs.existsSync(filePath);
  }

  async swithToPrintTab() {
    const tabs = await browser.getAllWindowHandles();
    expect(tabs.length).toEqual(2);
    browser.switchTo().window(tabs[1]);
  }
}
