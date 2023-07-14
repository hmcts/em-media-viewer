'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function (commentText) {
  const I = this;
  await I.highlightPdfText();
  await I.retry(2).click(commonConfig.highLightPopup);
  await I.waitForElement(commonConfig.commentPopup, 30);
  await I.retry(2).click(commonConfig.commentPopup);
  await I.fillField(commonConfig.firstCommentXp, commentText);
  await I.retry(3).click(commonConfig.saveButton);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
