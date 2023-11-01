'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const {mvData} = require("../common/constants");

module.exports = async function (annotationToDelete, updatedComment) {
  const I = this;
  await I.clickCommentsPanel();

  if (annotationToDelete === mvData.DELETE_ANNOTATION) {
    if (await I.getBookmarksCount(commonConfig.commentsCount) !== 0) {
      await I.deleteAllExistingComments();
    }
  } else {
    await I.click(commonConfig.commentsCount);
    await I.wait(testConfig.BookmarksAndAnnotationsWait)
    await I.click(commonConfig.editButton);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.clearField(commonConfig.clearFiledXp);
    await I.fillField(commonConfig.clearFiledXp, updatedComment);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.editButton);
    await I.wait(testConfig.BookmarksAndAnnotationsWait)
  }
  await I.refreshPage();
};
