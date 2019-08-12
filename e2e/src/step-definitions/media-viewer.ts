import {When, Given, Then} from 'cucumber';
import {AppPage} from '../pages/app.po';
import {browser, by} from 'protractor';
import {NavigatePage} from '../pages/navigate.po';
import {expect} from 'chai';
import {ToolBar} from '../pages/toolbar.po';
import {PrintPage} from '../pages/print.po';


const page = new AppPage();
const navigatePage: NavigatePage = new NavigatePage();
const toolBar = new ToolBar();
const printPage = new PrintPage();

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
  await toolBar.clickTextIcon();
  await toolBar.clickTextIcon();
});

Then('I expect Annotate button must be enabled', async function() {
  const screenshot = await browser.takeScreenshot();
  this.attach(screenshot, 'image/png');
});

When('I select a text on pdf doc', async () => {
  await toolBar.clickTextIcon();
  await page.selectPDFText();

});

Then('I expect text highlight popup should appear', async () => {
});

Then(/^I select a text on pdf$/, async () => {
});

Then('I add a comment to the selected PDF text', async () => {
});

Then('I check whether the comment has been created', async () => {
});

Then('I verify whether the comment has been saved', async () => {
});


When('the user selects the print option', async () => {
  await printPage.clickPrint();
});


When('the user selects the printer', function () {
});


Then('I expect the file is queued for printing', function () {
});
