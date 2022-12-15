const testConfig = require('./../../config');
const {mvData} = require('../pages/common/constants.js');
const {navigateBundleDocsUsingPageIndexTest, navigateNestedDocsUsingIndexTest} = require("../helpers/mvCaseHelper");

Feature('Index & Outline Feature');

Scenario('Navigate Bundle Documents Through Page Index Number', async ({I}) => {
  await navigateBundleDocsUsingPageIndexTest(I, mvData.INDEX_AND_OUTLINE_CASE, mvData.PDF_DOCUMENT, mvData.BUNDLE_DOCUMENT_NAME_TO_NAVIGATE, mvData.OUTLINE_PAGE_NUMBER_TO_NAVIGATE, mvData.ASSERT_BUNDLE_DOC_NAME);

}).tag('@EM-4865')
  .retry(testConfig.TestRetryScenarios);

Scenario('Navigate Nested Documents Using Index', async ({I}) => {
  await navigateNestedDocsUsingIndexTest(I, mvData.INDEX_AND_OUTLINE_CASE, mvData.PDF_DOCUMENT, mvData.NESTED_DOCUMENT_NAME_TO_NAVIGATE, mvData.NESTED_PAGE_NUMBER_TO_NAVIGATE, mvData.NESTED_PAGE_CONTENT);

}).tag('@EM-4865')
  .retry(testConfig.TestRetryScenarios);
