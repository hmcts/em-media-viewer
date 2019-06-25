import { Given, Then } from 'cucumber';
import { AppPage } from '../pages/app.po';
import { by } from 'protractor';
import * as chai from 'chai';

const page = new AppPage();

Given('I am on Media Viewer Page',  async () => {
  await page.preparePage();
});

Given('I enable toggle buttons', async () => {
  await page.showToolbarButtons();
});

Then('I expect toolbar icons should appear', async () => {
  await page.waitForElement(by.css('label[for="download-btn-toggle"]'));
});

Then('I expect the page header to be {string}', async (text: string) => {
  const header = await page.getHeaderText();

  chai.expect(header).to.equal(text);
});
