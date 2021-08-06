import {browser} from 'protractor';
import {Then, When} from 'cucumber';
import {MultimediaPage} from '../pages/multimedia.po';
import {GenericMethods} from '../utils/genericMethods';

const genericMethods = new GenericMethods();
const multimediaPage = new MultimediaPage();

When('the user selects the multimedia option', async () => {
  await multimediaPage.clickMultimedia();
  await genericMethods.sleep(5000);
});

When('the user selects play option', async () => {
  await multimediaPage.clickPlayButton();
});

Then('I should see video in play mode', async function ()  {
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

When('the user selects pause option', async () => {
  await multimediaPage.clickPlayButton();
});

Then('I should see video in pause mode', async function () {
  await genericMethods.sleep(5000);
  await multimediaPage.clickPlayButton();
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});
