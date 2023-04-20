const testConfig = require('./../../config');
const {
  nonTextualHighlightAndAddACommentTest, deleteNonTextualCommentTest,
  nonTextualHighlightUsingDrawBoxTest, updateNonTextualCommentTest
} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Image Viewer Annotations & Comments Feature');

Scenario('Non Textual Highlight & Add comment in image viewer', async ({I}) => {
  await nonTextualHighlightAndAddACommentTest(I, mvData.IMAGE_VIEWER_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Ability to highlight the image viewer using Draw-box function', async ({I}) => {
  await nonTextualHighlightUsingDrawBoxTest(I, mvData.IMAGE_VIEWER_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Update Non Textual comment in image viewer', async ({I}) => {
  await updateNonTextualCommentTest(I, mvData.IMAGE_VIEWER_CASE, mvData.PDF_DOCUMENT);

}).tag('@EM-5006')
  .retry(testConfig.TestRetryScenarios);

Scenario('Delete Non Textual comment in image viewer', async ({I}) => {
  await deleteNonTextualCommentTest(I, mvData.IMAGE_VIEWER_CASE, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);
