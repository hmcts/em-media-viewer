import {browser} from 'protractor';
import {Then, When} from 'cucumber';
import {MultimediaPage} from '../pages/multimedia.po';
import {GenericMethods} from '../utils/genericMethods';

const genericMethods = new GenericMethods();
const multimediaPage = new MultimediaPage();

When('I select the multimedia option', async () => {
  await multimediaPage.clickMultimedia();
  await genericMethods.sleep(5000);
});

When('I click play option', async () => {
  await multimediaPage.clickPlayButton();
});

Then('I should see video in play mode', async function ()  {
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

When('I click {string} option', async () => {
  await multimediaPage.clickPlayButton();
});

Then('I should see video in {string} mode', async function () {
  await genericMethods.sleep(5000);
  await multimediaPage.clickPlayButton();
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});
