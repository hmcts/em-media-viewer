import {When, Given, Then} from 'cucumber';
import {AppPage} from '../pages/app.po';
import {by} from 'protractor';
import * as chai from 'chai';
import {NavigatePage} from '../pages/navigate.po';

const page = new AppPage();
const navigatePage: NavigatePage = new NavigatePage();

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
  navigatePage.pageNumber.getAttribute('value').then(function (value) {
    chai.expect(value).to.equal(text);
  });
});


Then('I should see previous page number should be {string}', async (text: string) => {
  navigatePage.pageNumber.getAttribute('value').then(function (value) {
    chai.expect(value).to.equal(text);
  });
});

