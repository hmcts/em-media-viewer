import {After, Before, Status} from 'cucumber';
import { browser } from 'protractor';

Before({tags: '@MediaViewer'}, async () => {
  await browser.waitForAngularEnabled(false);
  return await browser.driver.navigate().to(browser.baseUrl);
  /*return browser.driver.manage().window().maximize(); */
});

After(function () {
  console.log('Successfully run the tests');

});

After(async (scenario) => {
  if (scenario.result.status === Status.FAILED) {
    const screenshot = await browser.takeScreenshot();
    // const stream = fs.createWriteStream('./reports/fail.png');
    //
    // stream.write(new Buffer(screenshot, 'base64'));
    // stream.end();
    return this.attach(screenshot, 'image/png');
  }
});

