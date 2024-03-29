const testConfig = require('./../../config');
const {createCaseInCcd} = require("../helpers/ccdDataStoreApi");
const {submittedState} = require("../helpers/mvCaseHelper");
let caseNumber;

Feature('Create CCD Case ');

Scenario('Create CCD Case for MV...', async ({I}) => {

  caseNumber = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json');
  await submittedState(I, caseNumber);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios);
