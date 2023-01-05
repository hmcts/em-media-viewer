const {mvData} = require("../pages/common/constants");
const testConfig = require('./../../config');

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
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.executeContentSearch(searchKeyword, noOfFindings);
  }
}

async function navigateSearchResultsUsingPreviousNextLinksTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.searchResultsNavigationUsingPreviousAndNextLinks(searchKeyword, noOfFindings);
  }
}

async function searchResultsNotFoundTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function enterShouldJumpViewerToNextSearchResultsTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.enterShouldJumpViewerToNextSearchResult(searchKeyword, noOfFindings);
  }
}

async function pdfViewerPageNavigationTest(I, caseId, mediaType, pageNoToNavigate) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.pdfViewerPageNavigation(pageNoToNavigate);
  }
}

async function pdfViewerZoomInOutTest(I, caseId, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    if (mediaType === 'example.pdf') {
      await openCaseDocumentsInMediaViewer(I, caseId, mediaType)
      await I.executePdfViewerZoom();

    } else {
      await openCaseDocumentsInMediaViewer(I, caseId, mediaType)
      await I.openCaseDocumentsInMV(mediaType);
      await I.executePdfViewerZoom();
    }
  }
}

async function downloadPdfDocFromMVTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.downloadPdfDocument();
}

async function printDocumentFromMVTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.mvPrintDocument();
}

async function pdfAndImageRotationTest(I, caseId, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.rotatePdfAndJpg();
  }
}

async function createBookmarkTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.clearBookMarks();
  await I.createBookMark();
}

async function deleteBookmarkTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.clearBookMarks();
}

async function updateBookmarkTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.clearBookMarks();
  await I.createBookMark();
  await I.updateBookMarks();
}

async function addEmptyBookmarksTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.clearBookMarks();
  await I.addEmptyBookmarks();
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
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("CONFIG FLAG==>::" + process.env.ExecuteTestsOnPRAndLocal);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.highlightPdfText();
}

async function addCommentTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal=== testConfig.ExecuteTestsOnPRAndLocal) {
    console.log("Jenkins PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Config PREVIEW FLAG==>::" + testConfig.ExecuteTestsOnPRAndLocal);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.addComments();
}

async function deleteCommentTest(I, caseId, mediaType, comment, updatedComment) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.deleteComments(comment, updatedComment);
}

async function collateCommentsTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.clickCommentsPanel();
  await I.collateComments();
}

async function commentsSearchTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.clickCommentsPanel();
  await I.commentsSearch();
}

async function addMultipleCommentsTest(I, caseId, mediaType) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("PREVIEW FLAG==>::" + process.env.EXECUTE_E2E);
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.addMultipleComments();
}

async function markContentForRedactionUsingDrawBoxTest(I, caseId, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.markContentForRedaction();
  }
}

async function redactContentUsingRedactTextTest(I, caseId, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.redactContentUsingRedactText();
  }
}

async function createRedactionsUsingDrawBoxAndRedactText(I, caseId, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.CreateRedactionsUsingDrawboxAndRedactText();
  }
}

async function redactTextAndThenRemovingRedactionTest(I, caseId, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.redactTextAndThenRemoveRedaction();
  }
}

async function previewAllRedactionsTest(I, caseId, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.previewAllRedactions();
  }
}

async function saveAllRedactionsTest(I, caseId, mediaType) {
  if (process.env.TEST_URL.split('-')[3] !== 'pr' || await getEnvironment() !== 'local') {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
    await I.saveAllRedactions();
  }
}

async function navigateBundleDocsUsingPageIndexTest(I, caseId, mediaType, bundlePageName, assertBundlePage) {
  if (testConfig.ExecuteTestsOnPRAndLocal === true) {
    console.log("Executing Tests on PREVIEW==>::" + await I.grabCurrentUrl());
    await I.amOnPage(testConfig.PreviewOrLocalEnvUrl, testConfig.PageLoadTime);
  } else {
    await openCaseDocumentsInMediaViewer(I, caseId, mediaType);
  }
  await I.navigateIndexBundleDocument(bundlePageName, assertBundlePage);
}

async function openCaseDocumentsInMediaViewer(I, caseId, mediaType) {
  await I.authenticateWithIdam();
  console.log("Executing Tests on AAT==>::" + await I.grabCurrentUrl());
  await I.amOnPage('/case-details/' + caseId);
  if (mediaType === mvData.PDF_DOCUMENT) {
    await I.openCaseDocumentsInMV(mediaType);
  }
}

async function getEnvironment() {
  return testConfig.PreviewOrLocalEnvUrl.includes('local') ? 'local' : 'aat';
}

async function uploadDocumentEvent(I, caseId, eventName) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.chooseNextStep(eventName, 3)
}

module.exports = {
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
  multiMediaAudioTest,
  multiMediaAudioPauseAndRewindTest,
  highlightTextTest,
  addCommentTest,
  deleteCommentTest,
  collateCommentsTest,
  commentsSearchTest,
  addMultipleCommentsTest,
  markContentForRedactionUsingDrawBoxTest,
  redactContentUsingRedactTextTest,
  navigateBundleDocsUsingPageIndexTest,
  redactTextAndThenRemovingRedactionTest,
  createRedactionsUsingDrawBoxAndRedactText,
  previewAllRedactionsTest,
  saveAllRedactionsTest
}
