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

async function mvContentSearchTest(I, caseId, eventName, searchKeyword, noOfFindings) {
  await uploadPdf(I, caseId, eventName);
  await I.executeContentSearchTest(searchKeyword, noOfFindings);
}

async function navigateSearchResultsUsingPreviousNextLinksTest(I, caseId, searchKeyword, noOfFindings) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.navigateSearchResultsTest(searchKeyword, noOfFindings);
}

async function searchResultsNotFoundTest(I, caseId, eventName, searchKeyword, noOfFindings) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.executeContentSearchTest(searchKeyword, noOfFindings);
}

async function pdfViewerZoomInOutTest(I, caseId, eventName, uploadDocType) {
  if (uploadDocType === mvData.PDF_DOCUMENT) {
    await uploadPdf(I, caseId, eventName);
    await I.pdfViewerZoomTest();

  } else {
    await uploadJpeg(I, caseId, eventName);
    await I.pdfViewerZoomTest();
  }
}

module.exports = {
  submittedState,
  uploadPdf,
  uploadJpeg,
  uploadWorDoc,
  mvContentSearchTest,
  searchResultsNotFoundTest,
  pdfViewerZoomInOutTest,
  navigateSearchResultsUsingPreviousNextLinksTest
}
