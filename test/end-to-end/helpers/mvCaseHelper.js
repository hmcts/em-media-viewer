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

async function contentSearchTest(I, caseId, eventName, searchKeyword, noOfFindings, mediaType) {
  await uploadPdf(I, caseId, eventName);
  await I.openMediaTypeInMediaViewer(mediaType);
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function navigateSearchResultsUsingPreviousNextLinksTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  await openPDFDocInMediaViewer(I, caseId, mediaType);
  await I.searchResultsNavigationUsingPreviousAndNextLinks(searchKeyword, noOfFindings);
}

async function searchResultsNotFoundTest(I, caseId, eventName, searchKeyword, noOfFindings, mediaType) {
  await openPDFDocInMediaViewer(I, caseId, mediaType);
  await I.executeContentSearch(searchKeyword, noOfFindings);
}

async function enterShouldJumpViewerToNextSearchResultsTest(I, caseId, searchKeyword, noOfFindings, mediaType) {
  await openPDFDocInMediaViewer(I, caseId, mediaType);
  await I.enterShouldJumpViewerToNextSearchResult(searchKeyword, noOfFindings);
}

async function pdfViewerPageNavigationTest(I, caseId, mediaType) {
  await openPDFDocInMediaViewer(I, caseId, mediaType);
  await I.pdfViewerPageNavigation();
}

async function pdfViewerZoomInOutTest(I, caseId, eventName, mediaType) {
  if (mediaType === 'example.pdf') {
    await openPDFDocInMediaViewer(I, caseId, mediaType)
    await I.executePdfViewerZoom();

  } else {
    await openPDFDocInMediaViewer(I, caseId, mediaType)
    await I.openMediaTypeInMediaViewer(mediaType);
    await I.executePdfViewerZoom();
  }
}

async function downloadPdfDocFromMVTest(I, caseId, mediaType) {
  await openPDFDocInMediaViewer(I, caseId, mediaType);
  await I.downloadPdfDocument();
}

async function printDocumentFromMVTest(I, caseId, mediaType) {
  await openPDFDocInMediaViewer(I, caseId, mediaType);
  await I.MvPrintDocument();
}


async function pdfAndImageRotationTest(I, caseId, mediaType) {
  await openPDFDocInMediaViewer(I, caseId, mediaType);
  await I.rotatePdfAndJpg();
}

async function openPDFDocInMediaViewer(I, caseId, mediaType) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);

  if (mediaType === mvData.PDF_DOCUMENT) {
    await I.openMediaTypeInMediaViewer(mediaType);
  } else if (mediaType === mvData.IMAGE_DOCUMENT) {
    await I.openMediaTypeInMediaViewer(mediaType);
  } else {
    console.warn("Media Viewer does not support  document type");
  }
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
  // openPDFDocInMediaViewer,
  // uploadDocumentEvent,
  contentSearchTest,
  searchResultsNotFoundTest,
  downloadPdfDocFromMVTest,
  pdfViewerZoomInOutTest,
  printDocumentFromMVTest,
  pdfViewerPageNavigationTest,
  pdfAndImageRotationTest,
  navigateSearchResultsUsingPreviousNextLinksTest,
  enterShouldJumpViewerToNextSearchResultsTest
}
