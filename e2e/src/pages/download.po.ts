import { browser, by, element } from "protractor";
import { AppPage } from "./app.po";
const fs = require("fs");

export class DownloadPage extends AppPage {

  async clickDownload() {
    await this.clickElement(by.id("download"));
  }

  async waitForDownloadToComplete(path: string) {
    await browser.wait(() => fs.existsSync(path), 3000);
  }

  hasFileDownloaded(filePath: string) {
    return fs.existsSync(filePath);
  }
}
