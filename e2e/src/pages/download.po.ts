import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';
const fs = require('fs');

export class DownloadPage extends AppPage {

  clickDownload() {
    return element(by.id('download')).click();
  }

  async hasFileDownloaded(filePath) {
    await browser.wait(async () => fs.existsSync(filePath), 3000, 'File failed to download');
    return fs.existsSync(filePath);
  }
}
