const testConfig = require('./../../config');
const {createBookmarkTest, deleteBookmarkTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Bookmarks Feature');

Scenario('Create a bookmark using highlight function', async ({I}) => {
  await createBookmarkTest(I, mvData.CCD_CASE_FOR_BOOKMARKS, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Delete Bookmark', async ({I}) => {
  await deleteBookmarkTest(I, mvData.CCD_CASE_FOR_BOOKMARKS, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);
