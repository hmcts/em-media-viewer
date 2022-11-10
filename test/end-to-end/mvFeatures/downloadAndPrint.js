const testConfig = require('./../../config');
const {downloadPdfDocFromMVTest, printDocumentFromMVTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Download And Print Feature');

Scenario('Download PDF Document from Media Viewer', async ({I}) => {
  await downloadPdfDocFromMVTest(I, mvData.CASE_ID);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Print PDF Document from Media Viewer', async ({I}) => {
  await printDocumentFromMVTest(I, mvData.CASE_ID);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);
