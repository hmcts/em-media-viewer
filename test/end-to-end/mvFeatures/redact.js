const testConfig = require('./../../config');
const {markContentForRedactionTest, redactContentUsingRedactTextTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Redact Feature');

Scenario('Mark Content For Redaction', async ({I}) => {
  await markContentForRedactionTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@wip')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact Content Using Redact Text Function', async ({I}) => {
  await redactContentUsingRedactTextTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@np')
  .retry(testConfig.TestRetryScenarios);




