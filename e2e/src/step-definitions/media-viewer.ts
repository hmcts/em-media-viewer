import {When, Given, Then} from 'cucumber';
// tslint:disable-next-line:import-spacing
import {NavigatePage} from '../pages/navigate.po';
import {AppPage} from '../pages/app.po';
import {by, element} from 'protractor';
import * as chai from 'chai';

const expect = chai.expect;

const page = new AppPage();
const navigatePage = new NavigatePage();

Given('I am on Media Viewer Page', async () => {
  await page.preparePage();
});

Given('I enable toggle buttons', async () => {
  await page.showToolbarButtons();
});

Then('I expect toolbar buttons should be enabled', async () => {
  await page.waitForElement(by.css('label[for="download-btn-toggle"]'));
});

Then('I expect the page header to be {string}', async (text: string) => {
  const header = await page.getHeaderText();
  chai.expect(header).to.equal(text);
});

When('I click next button on the pdf', async () => {
  await page.selectPdfViewer();
  await page.preparePage();
  await page.waitForPdfToLoad();
  await navigatePage.goToNextPage();
});

When('I click previous button on the pdf', async () => {
  await page.selectPdfViewer();
  await page.preparePage();
  await page.waitForPdfToLoad();
  await navigatePage.goToPreviousPage();
});


Then('I should see next page number should be {string}', async (text: string) => {
  const number: number = +text;
  console.log('Input::-->' + number);
  console.log('Navigate Page Number' + navigatePage.number());
  expect(navigatePage.number()).to.equal(number);
});


Then('I should see previous page number should be {string}', async (text: string) => {
  const number: number = +text;
  console.log('Input 2::-->' + number);
  chai.expect(navigatePage.number()).to.equal(number);
});

