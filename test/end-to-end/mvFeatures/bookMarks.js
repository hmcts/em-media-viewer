const testConfig = require('./../../config');
const {createBookmarkTest, deleteBookmarkTest} = require("../helpers/mvCaseHelper");
const {addEmptyBookmarksTest, updateBookmarkTest, sortBookmarksTest, bookmarkBoxBlankTest, add30BookmarksTest, customAndReorderBookmarksTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Bookmarks Feature');

Scenario('Create a bookmark using highlight function', async ({I}) => {
  await createBookmarkTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Update Bookmark', async ({I}) => {
  await updateBookmarkTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Delete Bookmark', async ({I}) => {
  await deleteBookmarkTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Add an empty bookmark', async ({I}) => {
  await addEmptyBookmarksTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Sort bookmarks', async ({I}) => {
  await sortBookmarksTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('custom order and reorder bookmarks', async ({I}) => {
  await customAndReorderBookmarksTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);
  
}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('check if bookmark box is blank', async ({I}) => {
  await bookmarkBoxBlankTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);
  
}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Add 30 bookmarks', async ({I}) => {
  await add30BookmarksTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);  
