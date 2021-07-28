import {browser, by, element} from 'protractor';
import {AppPage} from './app.po';

const fs = require('fs');

export class DownloadPage extends AppPage {

  async clickDownload() {
    await this.clickElement(by.id('download'));
  }

  async waitForDownloadToComplete(path: string) {
    await browser.wait(() => fs.existsSync(path), 3000);
  }

  hasFileDownloaded(filePath: string) {
    return fs.existsSync(filePath);
  }

  async clickMoreOptions() {
    await this.clickElement(by.id('mvMoreOptionsBtn'));
  }

  async clickDownloadButton() {
    await this.clickElement(by.xpath('/html/body/div/div/div/div/button[8]'));
  }
}
