import {browser} from 'protractor';

export class GenericMethods {

  async sleep(time: number) {
    await browser.sleep(time);
  }

  async switchToParentWindow() {
    browser.getAllWindowHandles().then(async function (handles: string[]) {
      const tabs = await browser.getAllWindowHandles();
      await expect(tabs.length).toEqual(2);
      await browser.driver.switchTo().window(handles[1]);
      await browser.driver.close();
      await browser.driver.switchTo().window(handles[0]);
    });
  }

  async scrollDown() {
    await browser.executeScript('window.scrollTo(0,10000);').then(async function () {
      console.log('SCROLLED Down');
    });
  }

  async scrollUp() {
    await browser.executeScript('window.scrollTo(0,0);').then(async function () {
      console.log('SCROLLED UP...');
    });
  }
}
