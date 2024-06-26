const testConfig = require('./../../config');
const {
  markContentForRedactionUsingDrawBoxTest,
  redactContentUsingRedactTextTest,
  redactTextAndThenRemovingRedactionTest,
  redactFirstPageTest,
  redactMultiplePagesTest,
  createRedactionsUsingDrawBoxAndRedactText,
  previewAllRedactionsTest,
  saveAllRedactionsTest,
  redactSearchAndRedactAllTest
} = require("../helpers/mvCaseHelper");
const { mvData } = require('../pages/common/constants.js');

Feature('Redact Feature');

Scenario('Mark Content For Redaction Using Draw Box Function ', async ({ I }) => {
  await markContentForRedactionUsingDrawBoxTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact Content Using Redact Text Function', async ({ I }) => {
  await redactContentUsingRedactTextTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact Content Using Search And Redact All Function', async ({ I }) => {
  await redactSearchAndRedactAllTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Create Redactions Using Draw Box and Redact Text Functions', async ({ I }) => {
  await createRedactionsUsingDrawBoxAndRedactText(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Preview all content marked for redaction', async ({ I }) => {
  await previewAllRedactionsTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Save redactions to download', async ({ I }) => {
  await saveAllRedactionsTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact text and then removing the redaction', async ({ I }) => {
  await redactTextAndThenRemovingRedactionTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact first page', async ({ I }) => {
  await redactFirstPageTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Redact multiple pages', async ({ I }) => {
  await redactMultiplePagesTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Clear redactions that are added when document has been downloaded', async ({ I }) => {
  await markContentForRedactionUsingDrawBoxTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);
  await saveAllRedactionsTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);
  await redactContentUsingRedactTextTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);

Scenario('Unmark selected content (marked for redaction)', async ({ I }) => {
  await redactContentUsingRedactTextTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);

Scenario('Unmark all content (marked for redaction)', async ({ I }) => {
  await redactContentUsingRedactTextTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);
