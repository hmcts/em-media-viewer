const testConfig = require('./../../config');
const {
  markContentForRedactionUsingDrawBoxTest,
  redactContentUsingRedactTextTest,
  redactTextAndThenRemovingRedactionTest,
  redactFirstPageTest,
  redactMultiplePagesTest,
  createRedactionsUsingDrawBoxAndRedactText,
  previewAllRedactionsTest,
  saveAllRedactionsTest
} = require("../helpers/mvCaseHelper");
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

Scenario('Create Redactions Using Draw Box and Redact Text Functions', async ({I}) => {
  await createRedactionsUsingDrawBoxAndRedactText(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Preview all content marked for redaction', async ({I}) => {
  await previewAllRedactionsTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Save redactions to download', async ({I}) => {
  await saveAllRedactionsTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact text and then removing the redaction', async ({I}) => {
  await redactTextAndThenRemovingRedactionTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact first page', async ({I}) => {
  await redactFirstPageTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@fnd')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact multiple pages', async ({I}) => {
  await redactMultiplePagesTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@fnd')
  .retry(testConfig.TestRetryScenarios);

Scenario('Unmark selected content (marked for redaction)', async ({I}) => {
  await redactContentUsingRedactTextTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);

Scenario('Unmark all content (marked for redaction)', async ({I}) => {
  await redactContentUsingRedactTextTest(I, mvData.REDACTION_CASE, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);
