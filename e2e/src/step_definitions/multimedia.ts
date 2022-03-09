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

When('I click {string} option', async (text: string) => {
  await multimediaPage.clickPlayButton();
});

Then('I should see {string} in play mode', async function (text: string)  {
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

Then('I should see {string} in {string} mode', async function (text: string, text1: string) {
  await genericMethods.sleep(5000);
  await multimediaPage.clickPlayButton();
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});
