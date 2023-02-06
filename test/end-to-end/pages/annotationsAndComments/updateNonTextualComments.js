'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function (annotationToDelete, updatedComment) {
  const I = this;
  await I.refreshPage();
  await I.clickCommentsPanel();

  if (await I.getBookmarksCount(commonConfig.commentsCount) !== 0) {
    let commentsList = await I.grabTextFromAll(commonConfig.commentsCount);
    commentsList.forEach(comment => console.log(comment));

    await I.click(commonConfig.commentsCount);
    await I.wait(testConfig.BookmarksAndAnnotationsWait)
    await I.click(commonConfig.editButton);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.clearField(commonConfig.clearFiledXp);
    await I.fillField(commonConfig.clearFiledXp, updatedComment);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.editButton);
    await I.wait(testConfig.BookmarksAndAnnotationsWait)
  } else {
    throw new Error("There is no comments")
  }
  await I.refreshPage();
};
