const {mvData} = require("../pages/common/constants");

async function submittedState(I, caseId) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
}

async function uploadPdf(I, caseId, eventName) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.chooseNextStep(eventName, 3);
  await I.uploadPdfDoc();
}

async function uploadJpeg(I, caseId, eventName) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.chooseNextStep(eventName, 3);
  await I.uploadImage();
}

async function uploadWorDoc(I, caseId, eventName) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.chooseNextStep(eventName, 3);
  await I.uploadWordDoc();
}

async function contentSearch(I, caseId, eventName, searchKeyword, noOfFindings) {
  await uploadPdf(I, caseId, eventName);
  await I.executeCommonSteps();
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function navigateSearchResultsUsingPreviousNextLinks(I, caseId, searchKeyword, noOfFindings) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.executeCommonSteps();
  await I.searchResultsNavigationUsingPreviousAndNextLinks(searchKeyword, noOfFindings);
}

async function searchResultsNotFound(I, caseId, eventName, searchKeyword, noOfFindings) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function enterShouldJumpViewerToNextSearchResultsScenario(I, caseId, searchKeyword, noOfFindings) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.enterShouldJumpViewerToNextSearchResult(searchKeyword, noOfFindings);
}

async function pdfViewerZoomInOut(I, caseId, eventName, uploadDocType) {
  if (uploadDocType === mvData.PDF_DOCUMENT) {
    await uploadPdf(I, caseId, eventName);
    await I.executePdfViewerZoom();

  } else {
    await uploadJpeg(I, caseId, eventName);
    await I.executePdfViewerZoom();
  }
}

module.exports = {
  submittedState,
  uploadPdf,
  uploadJpeg,
  uploadWorDoc,
  contentSearch,
  searchResultsNotFound,
  pdfViewerZoomInOut,
  navigateSearchResultsUsingPreviousNextLinks,
  enterShouldJumpViewerToNextSearchResultsScenario
}
