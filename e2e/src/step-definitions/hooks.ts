import { After, Status } from 'cucumber';
import { browser } from 'protractor';
import * as fs from 'fs';

After(async function(scenario) {
  if (scenario.result.status === Status.FAILED) {
    const screenshot = await browser.takeScreenshot();
    const stream = fs.createWriteStream('./reports/fail.png');

    stream.write(new Buffer(screenshot, 'base64'));
    stream.end();
  }
});
