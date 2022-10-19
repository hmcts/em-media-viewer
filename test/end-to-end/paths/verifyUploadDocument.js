const testConfig = require('./../../config');
const {createCaseInCcd} = require("../helpers/ccdDataStoreApi");
const {eventNames} = require('../pages/common/constants.js');
const {uploadDocumentEvent, submittedState} = require("../helpers/ccdCaseHelper");
let caseNumber;

Feature('Upload Document');

Scenario('Verify Upload Document', async ({I}) => {

  caseNumber = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json');
  await submittedState(I, caseNumber);
  await uploadDocumentEvent(I, eventNames.UPLOAD_DOCUMENT);

}).tag('@e2e')
  .retry(testConfig.TestRetryScenarios);
