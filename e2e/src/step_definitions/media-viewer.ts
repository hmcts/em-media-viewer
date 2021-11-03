import {Given, Then, When} from 'cucumber';
import {AppPage} from '../pages/app.po';
import {browser, by, element} from 'protractor';
import {NavigatePage} from '../pages/navigate.po';
import {expect} from 'chai';
import {ToolBar} from '../pages/toolbar.po';
import {PrintPage} from '../pages/print.po';
import {GenericMethods} from '../utils/genericMethods';
import {SearchPage} from '../pages/search.po';
import {RotatePage} from '../pages/rotate.po';
import {CommentPage} from '../pages/comment.po';
import {ZoomPage} from '../pages/zoom.po';
import {OutlinePage} from '../pages/outline.po';
import {CommentsPanelPage} from '../pages/commentspanel.po';
import {DownloadPage} from '../pages/download.po';

const page = new AppPage();
const navigatePage: NavigatePage = new NavigatePage();
const toolBar = new ToolBar();
const printPage = new PrintPage();
const genericMethods = new GenericMethods();
const searchPage = new SearchPage();
const rotatePage = new RotatePage();
const commentsPage = new CommentPage();
const zoomPage = new ZoomPage();
const outlinePage = new OutlinePage();
const commentsPanelPage = new CommentsPanelPage();
const downloadPage = new DownloadPage();

const ellipsisComment = 'This is comment number 1+Annotations Ellipsis EM-1814 story test';
const firstComment = 'This is comment number 1';
const secondComment = 'This is comment number 2';
const thirdComment = 'This is comment number 3';
const newComment = 'This is comment number 1 new';
const actual = 'Annotations Ellipsis EM-1814 story test';
const file = 'src/assets/example.pdf';

Given('I am on Media Viewer Page', async () => {
  await genericMethods.sleep(5000);
});

Then('I expect the page header to be {string}', async (text: string) => {
  const header = await page.getHeaderText();
  expect(header.toUpperCase()).to.equal(text);
});

When(/^I enable toggle buttons$/, async function () {
  await page.showCustomToolbarButtons();
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

When(/^I enter valid page number in page navigation text box:"([^"]*)"$/, async (num: number) => {
  await navigatePage.setPageNumber(num);
});

Then('I should see next page number should be {string}', async (expected: string) => {
  const value = await navigatePage.pageNumber.getAttribute('value');
  expect(parseInt(value, 10)).to.equal(parseInt(expected, 10));
});


Then(/^I expect the page navigation should take me to the expected "([^"]*)"$/, async function (expected: string) {
  const value = await navigatePage.pageNumber.getAttribute('value');
  expect(parseInt(value, 10)).to.equal(parseInt(expected, 10));
  expect(await page.isPageDataLoaded(parseInt(value, 10))).to.equal(true);
  const screenshot = await browser.takeScreenshot();
  this.attach(screenshot, 'image/png');
});


When('the user selects the print option', async () => {
  await printPage.clickPrint();
});

When('the user selects the download option', async () => {
  await downloadPage.clickMoreOptions();
  await genericMethods.clickAction('mvDownloadBtn');
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

Then('I capture the text highlight popup', async function () {
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

Then('I expect bookmark to be added to the existing list', async function () {
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

Then('I expect to see the document should be downloaded', async function () {
  await genericMethods.sleep(5000);
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
  await downloadPage.waitForDownloadToComplete(file);
});

const addComment = async (comment: string) => {
//   await highLightTextInPdf();
//   await page.highLightTextOnPdfPage();
//   await page.clickOnCommentButton();
//   await page.enterTextInAnnotation(comment);
//   await genericMethods.sleep(2000);
//   await page.clickOnSaveButton();

  await downloadPage.clickMoreOptions();
  await genericMethods.sleep(2000);
//   await page.clickOnCommentButton(); Change to: await commentsPanelPage.clickCommentsPanel();
  await genericMethods.sleep(2000);
  await downloadPage.clickMoreOptions();
  await genericMethods.sleep(2000);
  await page.enterTextInAnnotation(comment);
  await genericMethods.sleep(2000);
  await page.clickOnSaveButton();
};

export const highLightTextInPdf = async function () {
  await page.waitForPdfToLoad();
  await sleep(5000);
  await toolBar.enableTextHighLightMode();
  await page.highLightTextOnPdfPage();
};

const highLightTextForBookmarking = async function () {
  await page.waitForPdfToLoad();
  await toolBar.enableTextHighLightMode();
  await page.highLightTextForBookmarking();
};

let beforeDeleteBookMarksCount = 0;

const clearBookmarks = async function () {
  await page.clearBookmarks();
};

const toggleIndexButton = async function () {
  await page.toggleIndexButton();
};

const addBookmark = async function () {
  await page.createBookmarkUsingOverlay();

  const count: number = await page.getSaveBookMarksCount();
  expect(count).eq(1);

  await page.saveBookmarks();
};

const verifyBookmarkCount = async function (expectedCount: number) {
  const actualCount: number = await page.getBookMarksCount();
  expect(actualCount).eq(expectedCount);
};

const deleteBookmark = async function () {
  beforeDeleteBookMarksCount = await page.getBookMarksCount();
  await page.deleteBookmarks();
};

const verifyBookmarkCountAfterDelete = async function () {
  const actualCount: number = await page.getBookMarksCount();
  expect(actualCount).lessThan(beforeDeleteBookMarksCount);
};

const updateBookmark = async function (textToBeUpdated: string) {
  await page.updateBookmarks(textToBeUpdated);
};

const verifyBookmarkTextAfterUpdate = async function (textToBeUpdated: string) {
  const actualUpdatedText = await page.getUpdatedBookMarkName();
  expect(actualUpdatedText).eq(textToBeUpdated);

  await deleteBookmark();
  await verifyBookmarkCountAfterDelete();
};

const showBookmarks = async function () {
  await page.showBookmarks();
};

export const highLightOnImage = async () => {
  await sleep(5000);
  await toolBar.enableDrawHighLightMode();
  await page.drawOnImagePage();
};

export const drawOnPdf = async (xAxis: number, yAxis: number) => {
  await page.waitForPdfToLoad();
  await sleep(5000);
  await toolBar.enableDrawHighLightMode();
  await page.drawBoxOnPdfText(xAxis, yAxis);
};

const deleteComment = async () => {
  await page.deleteComment(firstComment);
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

const zoomInOutPdf = async (zoomOption: string) => {
  await zoomPage.zoomIn();
  expect(await zoomPage.currentZoom()).to.equal('110%');
  await zoomPage.zoomOut();
  expect(await zoomPage.currentZoom()).to.equal('100%');
  await zoomPage.setZoomTo('25%');
  expect(await zoomPage.currentZoom()).to.equal('25%');
  await zoomPage.setZoomTo('500%');
  await zoomPage.zoomIn();
  expect(await zoomPage.currentZoom()).to.equal('500%');
  await zoomPage.setZoomTo(zoomOption);
  expect(await zoomPage.currentZoom()).to.equal(zoomOption);
};

const imageZoomInOut = async (zoomOption: string) => {
  await zoomPage.zoomOut();
  expect(await zoomPage.currentZoom()).to.equal('90%');
  await zoomPage.zoomIn();
  expect(await zoomPage.currentZoom()).to.equal('100%');
  await zoomPage.setZoomTo('50%');
  expect(await zoomPage.currentZoom()).to.equal('50%');
  await zoomPage.setZoomTo('500%');
  await zoomPage.zoomIn();
  expect(await zoomPage.currentZoom()).to.equal('500%');
  await zoomPage.setZoomTo(zoomOption);
  expect(await zoomPage.currentZoom()).to.equal(zoomOption);
};

Then('I should be able to add comment for the highlight', async () => {
  await addComment(firstComment);
});

When('I highlight text on a PDF document', async () => {
  await highLightTextInPdf();
});

Then('I expect no existing bookmarks present', async () => {
  await clearBookmarks();
});

When('I highlight text to be bookmarked on the PDF document', async () => {
  await highLightTextForBookmarking();
});

When('I clear existing bookmarks', async () => {
  await clearBookmarks();
});

When('add a new bookmark', async () => {
  await highLightTextForBookmarking();
  await addBookmark();
  await toggleIndexButton();
});

When('I open document outline sidebar and click show bookmarks', async () => {
  await showBookmarks();

});

Then('I am able to add a bookmark and verify it has been created {int} bookmark', async (int) => {
  await addBookmark();
  await verifyBookmarkCount(int);
});

Then('I expect {int} bookmark is present in bookmarks list', async (int) => {
  await verifyBookmarkCount(int);
});

Then('I am able to update a bookmark with text {string} and verify it has been updated', async (string) => {
    await genericMethods.sleep(1000);
    await updateBookmark(string);
    await genericMethods.sleep(1000);
    await verifyBookmarkTextAfterUpdate(string);
});

Then('I am able to delete a bookmark and verify it has been deleted', async () => {
  await deleteBookmark();
  await verifyBookmarkCountAfterDelete();
});

function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

Then('The context toolbar should disappear', async () => {
  expect(await page.isContextToolBarVisible()).to.eq(false);
});

When('I select a textual comment and delete', deleteComment);

Given('The PDF has atleast one comment', async () => {
  await highLightTextInPdf();
  await addComment(firstComment);
});


Given('The PDF has atleast one non-textual comment', async () => {
  await drawOnPdf(300, 300);
  await addComment(firstComment);
});

Then('The comment should be deleted', async () => {
  expect(await page.getAllComments()).not.contain(firstComment);
});

Given('I change to Image Viewer tab', async () => {
  await page.selectImageViewer();
});

When('I highlight a portion of image', highLightOnImage);

Given('The image has atleast one non-textual comment', async () => {
  await highLightOnImage();
  await addComment(firstComment);
});

When('I select a non-textual comment and delete', deleteComment);

When('I update a non-textual comment and save', async () => {
  await page.updateComment(firstComment, newComment);
});

Then('The old comment should be replaced with new comment', async () => {
  const comment = await page.getComment();
  expect(comment).to.contain(newComment);
});

When('I update the existing comment', async () => {
  await page.updateComment(firstComment, newComment);
});

Then('I verify the amended text has been saved', async () => {
  const comment = await page.getComment();
  expect(comment).to.contain(newComment);
});

When(/^the user populate the content search field with a '(.*)'$/, async (text: string) => {
  await downloadPage.clickMoreOptions();
  await genericMethods.sleep(2000);
  await searchPage.clickSearchIcon();
  await genericMethods.sleep(2000);
  await downloadPage.clickMoreOptions();
  await genericMethods.sleep(2000);
  await searchPage.searchText(text);
});

Then(/^clicks on search button$/, async () => {
  await searchPage.clickSearchButton();
  await genericMethods.sleep(5000);
});

Then(/^the "([^"]*)" are displayed and highlighted to the user$/, async (searchCount: string) => {
  const count: string = await searchPage.getSearchCount();
  expect(count).to.equal(searchCount);
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
      await genericMethods.sleep(2000);
      await genericMethods.scrollDown();
      break;

    default:
      console.log('media viewer input tab is not found');
      break;
  }
});

When(/^I use the custom toolbar "([^"]*)" viewer rotate feature$/, async (viewerType: string) => {
  switch (viewerType) {

    case 'pdf' :
      await genericMethods.sleep(2000);
      break;

    case 'image' :
      await rotatePage.selectImageViewer();
      await genericMethods.sleep(2000);
      await genericMethods.scrollDown();
      break;

    default:
      console.log('media viewer input tab is not found');
      break;
  }
});


When('I highlight a portion of pdf in a Draw mode', async () => {
  await drawOnPdf(300, 300);
});

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


When('I create multiple non-textual comments on a PDF document', async () => {
  await drawOnPdf(300, 300);
  await addComment(firstComment);

  await drawOnPdf(350, 350);
  await addComment(secondComment);

  await drawOnPdf(400, 400);
  await addComment(thirdComment);

});

Then('I should be able to see all comments in the comments pane', async () => {
  expect(await page.getAllComments()).to.have.members([firstComment, secondComment, thirdComment]);
});

Given('The PDF has atleast one long comment', async () => {
  await highLightTextInPdf();
  await addComment(ellipsisComment);
});

When(/^I use the "([^"]*)" viewer "(.*) feature$/, async function (viewerType: string) {
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


When(/^I use zoom feature for "([^"]*)" viewer$/, async function (viewerType: string) {
  switch (viewerType) {
    case 'pdf' :
      await zoomPage.selectPdfViewer();
      break;

    case 'image' :
      await zoomPage.selectImageViewer();
      break;

    default:
      console.log('please select the correct input type...');
      break;
  }
});


Then(/^I must able to zoom by defined zoom_option:(.*), (.*)$/, async (zoomOption: string, viewerType: string) => {
  switch (viewerType) {
    case 'pdf' :
      await zoomInOutPdf(zoomOption);
      break;

    case 'image' :
      await imageZoomInOut(zoomOption);
      break;

    default:
      console.log('please select the correct input type...');
      break;
  }
});

When('I open document outline sidebar', async () => {
  await page.toggleIndexButton();
});

Then('I should be able to see bundle node and expand', async () => {
  await outlinePage.expandOutlineNode('Bundle');
});


When('I choose to navigate to {string}', async function (link: string) {
  await outlinePage.navigateToLink(link);
});

When('I enable custom toolbar', async () => {
  await page.showCustomToolbarButtons();
});

Then('I expect toolbar buttons should be enabled', async () => {
  await page.waitForElement(by.id('toggleCustomToolbar'));
});

Then('I expect custom toolbar should be enabled', async () => {
  await page.waitForElement(by.className('customToolbar'));
});

When(/^The user clicks on the show comments panel$/, async function () {
  await downloadPage.clickMoreOptions();
  await genericMethods.sleep(2000);
  await commentsPanelPage.clickCommentsPanel();
  await genericMethods.sleep(2000);
});

// I expect to see the comments filter and search tabs
Then(/^I expect to be able to click on the Filter Search And Comments Tab$/, async function () {
  await genericMethods.sleep(2000);
  await commentsPanelPage.clickOnCommentsTab();
  await genericMethods.sleep(2000);
  await commentsPanelPage.clickOnFilterTab();
  await genericMethods.sleep(2000);
  await commentsPanelPage.clickOnSearchTab();
});


When(/^I Search for Comments$/, async function () {
  await genericMethods.sleep(2000);
  const searchText = 'Some Random to Search';
  await commentsPanelPage.performSearch(searchText);
  await genericMethods.sleep(2000);

  const viewableDoc = await browser.takeScreenshot();
  this.attach(viewableDoc, 'image/png');
  // this.hideCommentsToggle();
});
Then(/^No matching results have been found$/, async function () {
  const noMatchText = 'No matches have been found';
  await commentsPanelPage.assertNoMatchSearchResultText(noMatchText);
});


When(/^The user clicks on the Comments Tab$/, async function () {
  await commentsPanelPage.clickOnCommentsTab();
});

When(/^The user clicks on Collate Comments$/, async function () {
  await commentsPanelPage.clickOnCollateCommentsButton();
});


Then(/^There are no comment rows present$/, async function () {
  await commentsPanelPage.assertNoCommentRowsPresent();
});

Then(/^The comment summary is displayed$/, async function () {
  await commentsPanelPage.assertCommentSummaryPresent();
//   const result = await this.commentsContainerHeader.getText();
//   const result = await genericMethods.clickAction('comment-container');
//   console.log('Result' + result);
//   expect(result).to.equal('Bury Metropolitan Council: TEST COURT BUNDLE');
});

When(/^The user closes the overlay panel$/, async function () {
  await commentsPanelPage.closeOverlayPanel();
});

When(/^The user clicks to hide the toggle icon$/, async function () {
  await commentsPanelPage.hideCommentsToggle();
});

Then('I expect to see comments panel should appear', async function () {
  const result = await commentsPanelPage.getCommentsTabText();
  console.log('Result' + result);
  expect(result.trim()).to.equal('Comments'.trim());
});

When('I click comments panel again', async () => {
  await commentsPanelPage.clickCommentsPanel();
});

Then('I expect comments panel should disappear', async function () {
  const result = await commentsPanelPage.getCommentsPanelText();
  expect(result).to.equal('Comments');
});

When(/^The user clicks on the show comments panel toggle icon$/, async function () {
  await downloadPage.clickMoreOptions();
  await genericMethods.sleep(2000);
  await commentsPanelPage.clickCommentsPanel();
  await genericMethods.sleep(2000);
  await downloadPage.clickMoreOptions();
});

