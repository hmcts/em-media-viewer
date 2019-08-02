import {When, Given, Then} from 'cucumber';
import {AppPage} from '../pages/app.po';
import {by} from 'protractor';
import {NavigatePage} from '../pages/navigate.po';
import {expect} from 'chai';

const page = new AppPage();
const navigatePage: NavigatePage = new NavigatePage();

Given('I am on Media Viewer Page', async () => {
  await page.preparePage();
});

When('I enable toggle buttons', async () => {
  await page.showToolbarButtons();
});

Then('I expect toolbar buttons should be enabled', async () => {
  await page.waitForElement(by.css('label[for="download-btn-toggle"]'));
});

Then('I expect the page header to be {string}', async (text: string) => {
  const header = await page.getHeaderText();
  expect(header).to.equal(text);
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

Then('I should see next page number should be {string}', async (expected: string) => {
  const value = await navigatePage.pageNumber.getAttribute('value');
  expect(parseInt(value, 10)).to.equal(parseInt(expected, 10));
});

Then('I should see previous page number should be {string}', async (expected: string) => {
  const value = await navigatePage.pageNumber.getAttribute('value');
  expect(parseInt(value, 10)).to.equal(parseInt(expected, 10));
});

When('I click Annotate button', async () => {

});

Then('I see Annotate button must be enabled', async () => {
});

When('I select a text on pdf doc', async () => {
});

Then('I expect text highlight popup should appear', async () => {
});

Then('I add a comment to the selected PDF text', async () => {
});

Then('I check whether the comment has been created or not?', async () => {
});

Then('I verify whether the comment has been saved or not?', async () => {
});
