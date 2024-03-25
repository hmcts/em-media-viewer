const testConfig = require('./../../config');
const { mvData } = require('../pages/common/constants.js');
const { navigateBundleDocsUsingPageIndexTest, navigateNestedDocsUsingIndexTest, loadNewDocument } = require("../helpers/mvCaseHelper");
const loadDocumentAndCheckSuccessLoad = require('../pages/indexAndOutline/loadDocumentAndCheckSuccessLoad.js');

Feature('Index & Outline Feature');

Scenario('Navigate Bundle Documents Through Page Index Number', async ({ I }) => {
  await navigateBundleDocsUsingPageIndexTest(I, mvData.IMAGE_VIEWER_CASE, mvData.PDF_DOCUMENT, mvData.BUNDLE_DOCUMENT_NAME_TO_NAVIGATE, mvData.OUTLINE_PAGE_NUMBER_TO_NAVIGATE, mvData.ASSERT_BUNDLE_DOC_NAME);

}).tag('@fnd')
  .retry(testConfig.TestRetryScenarios);

Scenario('Navigate Nested Documents Using Index', async ({ I }) => {
  await navigateNestedDocsUsingIndexTest(I, mvData.IMAGE_VIEWER_CASE, mvData.PDF_DOCUMENT, mvData.NESTED_DOCUMENT_NAME_TO_NAVIGATE, mvData.NESTED_PAGE_NUMBER_TO_NAVIGATE, mvData.NESTED_PAGE_CONTENT);

}).tag('@fnd')
  .retry(testConfig.TestRetryScenarios);


Scenario('Load new document with no outlines', async ({ I }) => {
  await loadNewDocument(I, mvData.CASE_ID, mvData.PDF_DOCUMENT, mvData.NO_OUTLINE_CASE_ID)

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);
