import {After, AfterAll, Before, BeforeAll, Status} from 'cucumber';
import {browser} from 'protractor';

// BeforeAll({timeout: 60 * 1000}, async () => {
//   await browser.driver.navigate().to(browser.baseUrl);
// });

Before(async function() {
  await browser.waitForAngularEnabled(false);
  await browser.driver.navigate().to(browser.baseUrl);
});


After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    const screenshots = await browser.takeScreenshot();
    this.attach(screenshots, 'image/png');
  }

  // AfterAll({timeout: 60 * 1000}, async () => {
  //   await browser.quit();
  // });
});
