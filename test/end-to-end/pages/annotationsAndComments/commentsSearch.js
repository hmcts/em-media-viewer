'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const {mvData} = require("../common/constants");

module.exports = async function () {
  const I = this;
  await I.deleteAllExistingComments();
  await I.addComments(mvData.UPDATED_COMMENT);
  await I.retry(2).click(commonConfig.commentsSearchLink)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.clearField(commonConfig.searchCommentsInput);
  await I.fillField(commonConfig.searchCommentsInput, mvData.UPDATED_COMMENT);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.retry(2).click(commonConfig.commentsSearchBtn)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.see(mvData.ASSERT_COMMENTS_SEARCH_COUNT);
}
