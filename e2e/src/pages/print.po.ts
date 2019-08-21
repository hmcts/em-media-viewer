import {browser, by, element} from 'protractor';
import {AppPage} from './app.po';


export class PrintPage extends AppPage {

  async clickPrint() {
    await this.clickElement(by.id('print'));
  }

  async getPrintDialog() {
    return element(by.css('print-preview-app'));
  }

  async switchToPrintTab() {
    const tabs = await browser.getAllWindowHandles();
    await expect(tabs.length).toEqual(2);
    await browser.switchTo().window(tabs[1]);
  }

  async closePrintDialog() {
    await browser.getAllWindowHandles().then(async function (handles) {
      browser.switchTo().window(handles[1]).then(async function () {
        await browser.sleep(10000);
        await browser.driver.close();
        await browser.switchTo().window(handles[0]);
      });
    });
  }
}
