const testConfig = require('./../../config');
const {highlightTextTest, addCommentTest, deleteAnnotationTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Annotations & Comments Feature');

Scenario('Ability to highlight and draw box on pdf document', async ({I}) => {
  await highlightTextTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT, 0, 0);

}).tag('@ci')
  .tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Highlight text and add a comment', async ({I}) => {
  await addCommentTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Delete a comment', async ({I}) => {
  await deleteAnnotationTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT, mvData.DELETE_ANNOTATION);

}).tag('@ci')
  .tag('@np')
  .retry(testConfig.TestRetryScenarios);

