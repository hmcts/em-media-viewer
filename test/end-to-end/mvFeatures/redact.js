const testConfig = require('./../../config');
const {markContentForRedactionUsingDrawBoxTest, redactContentUsingRedactTextTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Redact Feature');

Scenario('Mark Content For Redaction Using Draw Box Function ', async ({I}) => {
  await markContentForRedactionUsingDrawBoxTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact Content Using Redact Text Function', async ({I}) => {
  await redactContentUsingRedactTextTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Preview all content marked for redaction', async ({I}) => {
  await redactContentUsingRedactTextTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);

Scenario('Unmark selected content (marked for redaction)', async ({I}) => {
  await redactContentUsingRedactTextTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);

Scenario('Unmark all content (marked for redaction)', async ({I}) => {
  await redactContentUsingRedactTextTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);


