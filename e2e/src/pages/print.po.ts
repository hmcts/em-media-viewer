import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

export class PrintPage extends AppPage {

  async clickPrint() {
    await this.clickElement(by.id('print'));
  }

  async getPrintDialog() {
    await element(by.css('print-preview-app'));
  }

  async switchToPrintTab() {
    const tabs = await browser.getAllWindowHandles();
    expect(tabs.length).toEqual(2);
    await browser.switchTo().window(tabs[1]);
  }
}
