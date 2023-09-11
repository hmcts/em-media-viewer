const testConfig = require('../../config');
const {loginTest, updateBookmarkTest, addCommentTest, printDocumentFromMVTest, markContentForRedactionUsingDrawBoxTest, commentsSearchTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Smoke Test');

Scenario('Login to the manage case application', async ({I}) => {
  await loginTest(I);

}).retry(testConfig.TestRetryScenarios)
  .tag('@wip')

Scenario('Core Functionality Tested', async ({I}) => {
  await updateBookmarkTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);
  await addCommentTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);
  await commentsSearchTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);
  await printDocumentFromMVTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);
  await markContentForRedactionUsingDrawBoxTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).retry(testConfig.TestRetryScenarios)
  .tag('@wip')
