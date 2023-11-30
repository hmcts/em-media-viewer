const { mvData } = require("../pages/common/constants");
const testConfig = require('./../../config');
const commonConfig = require('../data/commonConfig.json');

async function loginTest(I) {
  await I.authenticateWithIdam();
}

async function submittedState(I, caseId) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
}

async function uploadPdf(I, caseId, eventName) {
  await uploadDocumentEvent(I, caseId, eventName);
  await I.uploadPdfDoc();
}

async function uploadJpeg(I, caseId, eventName) {
  await uploadDocumentEvent(I, caseId, eventName);
  await I.uploadImage();
}

async function uploadWorDoc(I, caseId, eventName) {
  await uploadDocumentEvent(I, caseId, eventName);
  await I.uploadWordDoc();
}

async function contentSearchTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function navigateSearchResultsUsingPreviousNextLinksTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.searchResultsNavigationUsingPreviousAndNextLinks(searchKeyword, noOfFindings);
}

async function searchResultsNotFoundTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function enterShouldJumpViewerToNextSearchResultsTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.enterShouldJumpViewerToNextSearchResult(searchKeyword, noOfFindings);
}

async function pdfViewerPageNavigationTest(I, caseId, mediaType, pageNoToNavigate) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.pdfViewerPageNavigation(pageNoToNavigate);
}

async function pdfViewerZoomInOutTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.executePdfViewerZoom();
}

async function downloadPdfDocFromMVTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.downloadPdfDocument();
}

async function printDocumentFromMVTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.mvPrintDocument();
}

async function pdfAndImageRotationTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.rotatePdfAndJpg();
}

async function createBookmarkTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.clearBookMarks();
  await I.createBookMark();
}

async function deleteBookmarkTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.clearBookMarks();
}

async function updateBookmarkTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.clearBookMarks();
  await I.createBookMark();
  await I.updateBookMarks();
}

async function addEmptyBookmarksTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.clearBookMarks();
  await I.addEmptyBookmarks();
}

async function sortBookmarksTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.clearBookMarks();
  await I.sortBookmarks();
}

async function bookmarkBoxBlankTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.clearBookMarks();
  await I.bookmarkBoxBlank();
}

async function multiMediaAudioTest(I, caseId, mediaType) {
  await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  await I.mvAudioScenario();
}

async function multiMediaAudioPauseAndRewindTest(I, caseId, mediaType) {
  await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  await I.clearBookMarks();
}

async function highlightTextTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.highlightPdfText();
}

async function addCommentAndRotateTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.addCommentAndRotate();
}

async function addCommentTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.addComments(commonConfig.firstComment1);
}

async function updateCommentTest(I, caseId, mediaType, comment, updatedComment) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.retry(3).click(commonConfig.commentsBtnId);
  await I.deleteAllExistingComments();
  await I.addComments(comment);
  await I.updateComment(comment, updatedComment);
}

async function deleteCommentTest(I, caseId, mediaType, comment, updatedComment) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.deleteComments(comment, updatedComment);
}

async function deleteHighlightsTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.highlightPdfText();
  await I.deleteAllExistingTextHighlights();
}

async function collateCommentsTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.click(commonConfig.commentsBtnId);
  await I.collateComments();
}

async function collateCommentsNotBlankTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.click(commonConfig.commentsBtnId);
  await I.deleteAllExistingComments();
  await I.addMultipleComments();
  await I.collateComments();
  await I.collateCommentsNotBlank();
}

async function commentsSearchTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.click(commonConfig.commentsBtnId);
  await I.deleteAllExistingComments();
  await I.commentsSearch();
}

async function addMultipleCommentsTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.addMultipleComments();
}

async function markContentForRedactionUsingDrawBoxTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.markContentForRedaction();
}

async function redactContentUsingRedactTextTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.redactContentUsingRedactText();
}

async function redactSearchAndRedactAllTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.redactSearchAndRedactAll();
}

async function createRedactionsUsingDrawBoxAndRedactText(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.CreateRedactionsUsingDrawboxAndRedactText();
}

async function redactTextAndThenRemovingRedactionTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.redactTextAndThenRemoveRedaction();
}

async function redactFirstPageTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.redactFirstPage();
}

async function redactMultiplePagesTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.redactMultiplePages();
}

async function previewAllRedactionsTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.previewAllRedactions();
}

async function saveAllRedactionsTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.saveAllRedactions();
}

async function navigateBundleDocsUsingPageIndexTest(I, caseId, mediaType, bundlePageName, bundlePageNumber, assertBundlePage) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.navigateIndexBundleDocument(bundlePageName, bundlePageNumber, assertBundlePage);
}

async function navigateNestedDocsUsingIndexTest(I, caseId, mediaType, nestedPageName, nestedPageNumber, pageContent) {
  await executeTestsOnPreview(I, caseId, mediaType)
  await I.navigateIndexNestedDocument(nestedPageName, nestedPageNumber, pageContent);
}

async function nonTextualHighlightAndAddACommentTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.openImage();
  await I.nonTextualHighlightAndComment();
}

async function nonTextualHighlightUsingDrawBoxTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.openImage();
  await I.deleteAllExistingNonTextualHighlights();
  await I.highlightOnImage(900, 900, 900, 900, ['mousedown', 'mousemove', 'mouseup'], 'box-highlight', 0);
}

async function updateNonTextualCommentTest(I, caseId, mediaType, comment, updatedComment) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.openImage();
  await I.updateNonTextualComments();
}

async function deleteNonTextualCommentTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.openImage();
  await I.deleteAllExistingNonTextualHighlights();
}


async function openCaseDocumentsInMediaViewer(I, caseId, mediaType) {
  await I.authenticateWithIdam();
  console.log(await I.grabCurrentUrl());
  await I.amOnPage('/case-details/' + caseId);
  if (mediaType === mvData.PDF_DOCUMENT) {
    await I.openCaseDocumentsInMV(mediaType);
  }
}

async function previewEnv() {
  return process.env.TEST_URL.includes(mvData.PREVIEW_ENV);
}

async function executeTestsOnPreview(I, caseId, mediaType) {
  await I.amOnPage(testConfig.TestUrl, testConfig.PageLoadTime);
  await I.waitForEnabled(commonConfig.assertEnvTestData, testConfig.TestTimeToWaitForText);
  console.log(await I.grabCurrentUrl());
}

async function uploadDocumentEvent(I, caseId, eventName) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.chooseNextStep(eventName, 3)
}

async function customAndReorderBookmarksTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.clearBookMarks();
  await I.createBookMark();
  await I.customOrderBookmarks();
  await I.reorderBookmarks();
}

async function add30BookmarksTest(I, caseId, mediaType) {
  await executeTestsOnPreview(I, caseId, mediaType);
  await I.clearBookMarks();
  await I.add30Bookmarks();
}

module.exports = {
  loginTest,
  submittedState,
  uploadPdf,
  uploadJpeg,
  uploadWorDoc,
  contentSearchTest,
  searchResultsNotFoundTest,
  downloadPdfDocFromMVTest,
  pdfViewerZoomInOutTest,
  printDocumentFromMVTest,
  pdfViewerPageNavigationTest,
  pdfAndImageRotationTest,
  navigateSearchResultsUsingPreviousNextLinksTest,
  enterShouldJumpViewerToNextSearchResultsTest,
  createBookmarkTest,
  deleteBookmarkTest,
  updateBookmarkTest,
  addEmptyBookmarksTest,
  sortBookmarksTest,
  multiMediaAudioTest,
  multiMediaAudioPauseAndRewindTest,
  highlightTextTest,
  addCommentAndRotateTest,
  addCommentTest,
  deleteCommentTest,
  deleteHighlightsTest,
  updateCommentTest,
  collateCommentsTest,
  collateCommentsNotBlankTest,
  commentsSearchTest,
  addMultipleCommentsTest,
  markContentForRedactionUsingDrawBoxTest,
  redactContentUsingRedactTextTest,
  navigateBundleDocsUsingPageIndexTest,
  navigateNestedDocsUsingIndexTest,
  redactTextAndThenRemovingRedactionTest,
  redactFirstPageTest,
  redactMultiplePagesTest,
  createRedactionsUsingDrawBoxAndRedactText,
  previewAllRedactionsTest,
  saveAllRedactionsTest,
  nonTextualHighlightAndAddACommentTest,
  nonTextualHighlightUsingDrawBoxTest,
  updateNonTextualCommentTest,
  deleteNonTextualCommentTest,
  redactSearchAndRedactAllTest,
  customAndReorderBookmarksTest,
  bookmarkBoxBlankTest,
  add30BookmarksTest
}
