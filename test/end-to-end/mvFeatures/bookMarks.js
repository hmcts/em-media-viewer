const testConfig = require('./../../config');
const {createBookmarkTest, deleteBookmarkTest} = require("../helpers/mvCaseHelper");
const {addEmptyBookmarksTest, updateBookmarkTest, sortBookmarksTest, add30BookmarksTest} = require("../helpers/mvCaseHelper");
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

Scenario('Add 30 bookmarks', async ({I}) => {
  await add30BookmarksTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@rr')
  .retry(testConfig.TestRetryScenarios);  