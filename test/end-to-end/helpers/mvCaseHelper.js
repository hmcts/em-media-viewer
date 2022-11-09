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

async function contentSearchTest(I, caseId, eventName, searchKeyword, noOfFindings) {
  await uploadPdf(I, caseId, eventName);
  await I.openPdfInMediaViewer();
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function navigateSearchResultsUsingPreviousNextLinksTest(I, caseId, searchKeyword, noOfFindings) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.searchResultsNavigationUsingPreviousAndNextLinks(searchKeyword, noOfFindings);
}

async function searchResultsNotFoundTest(I, caseId, eventName, searchKeyword, noOfFindings) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function enterShouldJumpViewerToNextSearchResultsTest(I, caseId, searchKeyword, noOfFindings) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.enterShouldJumpViewerToNextSearchResult(searchKeyword, noOfFindings);
}

async function pdfViewerPageNavigationTest(I, caseId) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.pdfViewerPageNavigation();
}

async function pdfViewerZoomInOutTest(I, caseId, eventName, uploadDocType) {
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

async function downloadPdfDocFromMVTest(I, caseId) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.downloadPdfDocument();
}

async function printDocumentFromMVTest(I, caseId) {
  await openPDFDocInMediaViewer(I, caseId);
  await I.MvPrintDocument();
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
  openPDFDocInMediaViewer,
  uploadDocumentEvent,
  contentSearchTest,
  searchResultsNotFoundTest,
  downloadPdfDocFromMVTest,
  pdfViewerZoomInOutTest,
  printDocumentFromMVTest,
  pdfViewerPageNavigationTest,
  navigateSearchResultsUsingPreviousNextLinksTest,
  enterShouldJumpViewerToNextSearchResultsTest
}
