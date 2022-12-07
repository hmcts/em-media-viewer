'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.retry(2).click(commonConfig.commentsLink)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.retry(2).click(commonConfig.commentsSummaryBtn);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  let commentsList = await I.grabTextFromAll(commonConfig.commentsCount);
  commentsList.forEach(comment => console.log("Collate Comments==>::" + comment));
}
