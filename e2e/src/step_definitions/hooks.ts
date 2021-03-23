import { After, Before, HookScenarioResult, Status } from "cucumber";
import { browser } from "protractor";

Before(async function () {
  await browser.driver.manage().window().maximize();
  await browser.waitForAngularEnabled(false);
  await browser.driver.navigate().to(browser.baseUrl);
});

After(async function (scenario: HookScenarioResult) {
  if (scenario.result.status === Status.FAILED) {
    const screenshots = await browser.takeScreenshot();
    const decodedImage = new Buffer(screenshots.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
    this.attach(decodedImage, "image/png");
  }
});

