async function submittedState(I, caseId) {
  await I.authenticateWithIdam();
  await I.amOnPage('/case-details/' + caseId);
}

async function uploadDocumentEvent(I, eventName) {
  await I.chooseNextStep(eventName, 3);
  await I.executeUploadDocument();
}

module.exports = {
  submittedState,
  uploadDocumentEvent
}
