const testConfig = require('./../../config');
const {
  collateCommentsTest,
  commentsSearchTest,
  addMultipleCommentsTest,
  highlightTextTest,
  addCommentTest,
  deleteCommentTest
} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Annotations & Comments Feature');

Scenario('Ability to highlight and draw box on pdf document', async ({I}) => {
  await highlightTextTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Highlight text and add a comment', async ({I}) => {
  await addCommentTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT);

}).tag('@pr')
  .retry(testConfig.TestRetryScenarios);

Scenario('Update a comment', async ({I}) => {
  await deleteCommentTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT, mvData.UPDATED_COMMENT, mvData.UPDATED_COMMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Annotations: Collate Comments', async ({I}) => {
  await collateCommentsTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Annotations: Search Comment Text', async ({I}) => {
  await commentsSearchTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Add multiple comments on multiples pages', async ({I}) => {
  await addMultipleCommentsTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);

Scenario('Delete a comment', async ({I}) => {
  await deleteCommentTest(I, mvData.ANNOTATIONS_BOOKMARKS_CASE, mvData.PDF_DOCUMENT, mvData.DELETE_ANNOTATION, mvData.UPDATED_COMMENT);

}).tag('@pr')
  .retry(testConfig.TestRetryScenarios);
