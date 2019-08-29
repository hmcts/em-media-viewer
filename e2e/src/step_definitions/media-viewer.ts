import {Given, Then, When} from 'cucumber';
import {AppPage} from '../pages/app.po';
import {browser, by} from 'protractor';
import {NavigatePage} from '../pages/navigate.po';
import {expect} from 'chai';
import {ToolBar} from '../pages/toolbar.po';
import {PrintPage} from '../pages/print.po';
import {GenericMethods} from '../utils/genericMethods';
import {SearchPage} from '../pages/search.po';
import {RotatePage} from '../pages/rotate.po';
import {CommentPage} from '../pages/comment.po';


const page = new AppPage();
const navigatePage: NavigatePage = new NavigatePage();
const toolBar = new ToolBar();
const printPage = new PrintPage();
const genericMethods = new GenericMethods();
const searchPage = new SearchPage();
const rotatePage = new RotatePage();
const commentsPage = new CommentPage();

const comment_1 = 'This is comment number 1+Annotations Ellipsis EM-1814 story test';
const comment_new = 'This is comment number 1 new';
const actual = 'Annotations Ellipsis EM-1814 story test';

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
  await page.waitForPdfToLoad();
  await navigatePage.goToNextPage();
  await genericMethods.sleep(5000);
});

When('I click previous button on the pdf', async () => {
  await page.selectPdfViewer();
  await page.waitForPdfToLoad();
  await navigatePage.goToPreviousPage();
  await genericMethods.sleep(5000);
});

Then('I should see next page number should be {string}', async (expected: string) => {
  const value = await navigatePage.pageNumber.getAttribute('value');
  expect(parseInt(value, 10)).to.equal(parseInt(expected, 10));
});

Then('I should see previous page number should be {string}', async (expected: string) => {
  const value = await navigatePage.pageNumber.getAttribute('value');
  expect(parseInt(value, 10)).to.equal(parseInt(expected, 10));
});


When('the user selects the print option', async () => {
  await printPage.clickPrint();
});


Then('I expect the print dialog should appear and the file is queued for printing', async function () {
  const screenshots = browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
  await printPage.switchToPrintTab();
});

When('I click Annotate button', async () => {
  await toolBar.clickTextIcon();
  await toolBar.clickTextIcon();
});

Then('I expect Annotate button must be enabled', async function () {
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

When('I select a text on pdf doc', async () => {
  await toolBar.clickTextIcon();
});

Then('I expect text highlight popup should appear', async function () {
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

const addComment = async () => {
  await page.clickOnCommentButton();
  await page.enterTextInAnnotation(comment_1);
  await page.clickOnSaveButton();
};

const highLightTextInPdf = async () => {
  await page.waitForPdfToLoad();
  await sleep(5000);
  await toolBar.enableTextHighLightMode();
  await page.highLightTextOnPdfPage();
};

const highLightOnImage = async () => {
  // await page.waitForPdfToLoad();
  await sleep(5000);
  await toolBar.enableDrawHighLightMode();
  await page.drawOnImagePage();
};

const drawOnPdf = async () => {
  await page.waitForPdfToLoad();
  await sleep(5000);
  await toolBar.enableDrawHighLightMode();
  await page.drawOnPDFPage();
};

const deleteComment = async () => {
  await page.deleteComment(comment_1);
};

const pdfRotate = async () => {
  await rotatePage.captureCurrentOrientation();
  await rotatePage.rotateClockwise();
  await rotatePage.checkPdfIsRotated();
  await rotatePage.captureCurrentOrientation();
  await rotatePage.rotateCounterClockwise();
  await rotatePage.checkPdfIsRotated();
};

const imageRotate = async () => {
  await rotatePage.rotateClockwise();
  await genericMethods.sleep(10000);
  await rotatePage.checkImageIsRotatedBy('90');
  await rotatePage.rotateCounterClockwise();
  await rotatePage.checkImageIsRotatedBy('0');
};


Then('I should be able to add comment for the highlight', addComment);

When('I highlight text on a PDF document', highLightTextInPdf);

function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

Then('The context toolbar should disappear', async () => {
  expect(await page.isContextToolBarVisible()).false;
});

When('I select a textual comment and delete', deleteComment);

Given('The PDF has atleast one comment', async () => {
  await highLightTextInPdf();
  await addComment();
});


Given('The PDF has atleast one non-textual comment', async () => {
  await drawOnPdf();
  await addComment();
});

Then('The comment should be deleted', async () => {
  expect(await page.getAllComments()).not.contain(comment_1);
});

Given('I change to Image Viewer tab', async () => {
  await page.selectImageViewer();
});

When('I highlight a portion of image', highLightOnImage);

Given('The image has atleast one non-textual comment', async () => {
  await highLightOnImage();
  await addComment();
});

When('I select a non-textual comment and delete', deleteComment);

When('I update a non-textual comment and save', async () => {
  await page.updateComment(comment_1, comment_new);
});

Then('The old comment should be replaced with new comment', async () => {
  const comment = await page.getComment();
  expect(comment).to.contain(comment_new);
});

When('I update the existing comment', async () => {
  await page.updateComment(comment_1, comment_new);
});

Then('I verify the amended text has been saved', async () => {
  const comment = await page.getComment();
  expect(comment).to.contain(comment_new);
});

When(/^the user populate the content search field with a '(.*)'$/, async (text: string) => {
  await searchPage.clickSearchIcon();
  await searchPage.searchText(text);
});

Then(/^the "([^"]*)" are displayed and highlighted to the user$/, async (search_count: string) => {
  const count: string = await searchPage.getSearchCount();
  expect(count).to.equal(search_count);
});

When(/^the section of the document is viewable to the user$/, async function () {
  await searchPage.clickFindIndex();
  await genericMethods.sleep(1000);
  const viewableDoc = await browser.takeScreenshot();
  this.attach(viewableDoc, 'image/png');
});

Then(/^I must rotate the "(.*)" document$/, async (viewerType: string) => {
  switch (viewerType) {
    case 'pdf' :
      await pdfRotate();
      break;

    case 'image' :
      await imageRotate();
      break;

    default:
      console.log('media viewer input tab is not found');
      break;
  }
});
When(/^I use the "([^"]*)" viewer rotate feature$/, async (viewerType: string) => {
  switch (viewerType) {

    case 'pdf' :
      await rotatePage.clickRotateButton();
      await genericMethods.sleep(2000);
      break;

    case 'image' :
      await rotatePage.selectImageViewer();
      await genericMethods.sleep(20000);
      await genericMethods.scrollDown();
      break;

    default:
      console.log('media viewer input tab is not found');
      break;
  }
});


When('I highlight a portion of pdf in a Draw mode', drawOnPdf);

Given(/^the PDF viewer has atleast one highlight$/, highLightTextInPdf);

When(/^I rotate PDF doc the pdf text highlights should be rotate$/, async () => {
  await rotatePage.captureCurrentOrientation();
  await rotatePage.rotateClockwise();
  await browser.sleep(5000);
});

Then(/^I should expect pdf text highlights are inline with rotation$/, async function () {
  const screenshot = await browser.takeScreenshot();
  this.attach(screenshot, 'image/png');
  await rotatePage.checkPdfIsRotated();
});

When(/^I click outside of the comment box$/, async () => {
  await commentsPage.clickCommentsContainer();
  await highLightTextInPdf();
});

Then(/^I expect comment should display in ellipsis format$/, async function () {
  const comment = await commentsPage.getCommentsText();
  expect(actual).to.contain(comment.split('+').pop());
  const screenshot = await browser.takeScreenshot();
  this.attach(screenshot, 'image/png');
});
