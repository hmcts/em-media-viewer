import {After, AfterAll, Before, BeforeAll, Status} from 'cucumber';
import {browser} from 'protractor';
// import pact, {Server} from '@pact-foundation/pact-node';
//
// let pactMockServer: Server;
//
// BeforeAll(async function() {
//   pactMockServer = pact.createStub({
//     port: 9999,
//     pactUrls: ['/Users/pawel/workspace/media-viewer/pacts/media_viewer-annotation_api.json']
//   });
//   await pactMockServer.start();
// });
//
//
// AfterAll(async function() {
//   pactMockServer.stop();
// });


Before({tags: '@MediaViewer'}, async function() {
  await browser.waitForAngularEnabled(false);
  await browser.driver.navigate().to(browser.baseUrl);
});


After(async function(scenario) {
  if (scenario.result.status === Status.FAILED) {
    const screenshot = await browser.takeScreenshot();
    this.attach(screenshot, 'image/png');
  }
});


