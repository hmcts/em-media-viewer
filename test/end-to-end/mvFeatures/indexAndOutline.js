const testConfig = require('./../../config');
const {mvData} = require('../pages/common/constants.js');
const {navigateBundleDocsUsingPageIndexTest} = require("../helpers/mvCaseHelper");

Feature('Index & Outline Feature');

Scenario('Navigate Bundle Documents Through Page Index Number', async ({I}) => {
  await navigateBundleDocsUsingPageIndexTest(I, mvData.INDEX_AND_OUTLINE_CASE, mvData.PDF_DOCUMENT, mvData.BUNDLE_DOCUMENT_NAME_TO_NAVIGATE, mvData.ASSERT_BUNDLE_DOC_NAME);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);
