import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

export class PrintPage extends AppPage {

  clickPrint() {
    return element(by.id('print')).click();
  }

  getPrintDialog() {
    return element(by.css('print-preview-app'));
  }

  async switchToPrintTab() {
    const tabs = await browser.getAllWindowHandles();
    expect(tabs.length).toEqual(2);
    browser.switchTo().window(tabs[1]);
  }
}
