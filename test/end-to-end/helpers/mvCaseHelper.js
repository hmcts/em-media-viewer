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

async function mediaViewerContentSearch(I, caseId, searchKeyword, noOfFindings) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
  await I.executeMVSearchContent(searchKeyword, noOfFindings);
}

module.exports = {
  submittedState,
  uploadPdf,
  uploadJpeg,
  uploadWorDoc,
  mediaViewerContentSearch
}
