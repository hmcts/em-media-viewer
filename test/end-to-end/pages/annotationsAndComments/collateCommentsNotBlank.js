'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.seeElement(commonConfig.collateCommentsCheck);
  await I.click(commonConfig.closeCommentSummary);

  await I.highlightOnImage(500, 500, 500, 500, ['mousedown', 'mousemove', 'mouseup'], 'box-highlight', 0);
  await I.retry(2).click(commonConfig.commentPopup);
  await I.fillField(commonConfig.firstCommentXp, commonConfig.firstComment1);
  await I.retry(3).click(commonConfig.saveButton);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.retry(2).click(commonConfig.commentsSummaryBtn);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.seeElement(commonConfig.collateCommentsCheck);

  let commentsList = await I.grabTextFromAll(commonConfig.commentsCount);
  commentsList.forEach(comment => console.log('collateCommentsNotBlank', comment));
}
