import {After, Before, HookScenarioResult, Status} from 'cucumber';
import {browser} from 'protractor';

let scenarioName;

Before(async function (scenario) {
  console.log(`Starting scenario ==>:: ${scenario.sourceLocation.uri}:${scenario.sourceLocation.line} (${scenario.pickle.name})`);
  scenarioName = scenario.pickle.name;
  await browser.driver.manage().window().maximize();
  await browser.waitForAngularEnabled(false);
  await browser.driver.navigate().to(browser.baseUrl);
});

After(async function (scenario: HookScenarioResult) {
  if (scenario.result.status === Status.FAILED) {
    const screenshots = await browser.takeScreenshot();
    const decodedImage = new Buffer(screenshots.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
    this.attach(decodedImage, 'image/png');
  }
});

