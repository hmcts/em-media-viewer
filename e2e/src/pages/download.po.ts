import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';
const fs = require('fs');

export class DownloadPage extends AppPage {

  clickDownload() {
    return element(by.id('download')).click();
  }

  async waitForDownloadToComplete(path) {
    await browser.wait(() => fs.existsSync(path), 3000);
  }

  hasFileDownloaded(filePath) {
    return fs.existsSync(filePath);
  }
}
