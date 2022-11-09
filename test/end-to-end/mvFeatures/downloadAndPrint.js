const testConfig = require('./../../config');
const {downloadPdfDocFromMVTest, printDocumentFromMVTest} = require("../helpers/mvCaseHelper");
const {createCaseInCcd} = require("../helpers/ccdDataStoreApi");
let caseId;

Feature('Download And Print Feature');

BeforeSuite(async ({I}) => caseId = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json'));

Scenario('Download PDF Document from Media Viewer', async ({I}) => {
  await downloadPdfDocFromMVTest(I, caseId);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Print PDF Document from Media Viewer', async ({I}) => {
  await printDocumentFromMVTest(I, caseId);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);
