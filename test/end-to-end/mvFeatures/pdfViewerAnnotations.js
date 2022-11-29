const testConfig = require('./../../config');
const {highlightTextTest, addCommentTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Annotations - Pdf viewer Feature');

Scenario('Annotations - Ability to highlight and draw box on pdf document', async ({I}) => {
  await highlightTextTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT, 0, 0);

}).tag('@ci')
  .tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Annotations - Highlight text and add a single comment', async ({I}) => {
  await addCommentTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .tag('@np')
  .retry(testConfig.TestRetryScenarios);

