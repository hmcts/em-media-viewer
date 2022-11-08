const {mvData} = require("../pages/common/constants");

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

async function contentSearch(I, caseId, eventName, searchKeyword, noOfFindings) {
  await uploadPdf(I, caseId, eventName);
  await I.openPdfInMediaViewer();
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function navigateSearchResultsUsingPreviousNextLinks(I, caseId, searchKeyword, noOfFindings) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.searchResultsNavigationUsingPreviousAndNextLinks(searchKeyword, noOfFindings);
}

async function searchResultsNotFound(I, caseId, eventName, searchKeyword, noOfFindings) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function enterShouldJumpViewerToNextSearchResultsScenario(I, caseId, searchKeyword, noOfFindings) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.enterShouldJumpViewerToNextSearchResult(searchKeyword, noOfFindings);
}

async function pdfViewerPageNavigationTest(I, caseId) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.pdfViewerPageNavigation();
}

async function pdfViewerZoomInOut(I, caseId, eventName, uploadDocType) {
  if (uploadDocType === mvData.PDF_DOCUMENT) {
    await uploadPdf(I, caseId, eventName);
    await I.openPdfInMediaViewer();
    await I.executePdfViewerZoom();

  } else {
    await uploadJpeg(I, caseId, eventName);
    await I.openPdfInMediaViewer();
    await I.executePdfViewerZoom();
  }
}

async function openPDFDocInMediaViewer(I, caseId) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.openPdfInMediaViewer();
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
  contentSearch,
  searchResultsNotFound,
  pdfViewerZoomInOut,
  pdfViewerPageNavigationTest,
  openPDFDocInMediaViewer,
  uploadDocumentEvent,
  navigateSearchResultsUsingPreviousNextLinks,
  enterShouldJumpViewerToNextSearchResultsScenario
}
