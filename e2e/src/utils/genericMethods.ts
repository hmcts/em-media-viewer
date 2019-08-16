import {browser} from 'protractor';

export class GenericMethods {
  async sleep(time: number) {
    await browser.sleep(time);
  }

  async switchWindows() {
    browser.getAllWindowHandles().then(async function (handles) {
      const tabs = await browser.getAllWindowHandles();
      await expect(tabs.length).toEqual(2);
      await browser.driver.switchTo().window(handles[1]);
      await browser.driver.close();
      await browser.driver.switchTo().window(handles[0]);
    });
  }

}
