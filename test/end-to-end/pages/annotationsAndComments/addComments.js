'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function (commentText) {
  const I = this;
  const comments = await I.grabNumberOfVisibleElements(commonConfig.commentsCount);
  await I.highlightPdfText();
  await I.waitForElement(commonConfig.commentPopup);
  await I.retry(2).click(commonConfig.commentPopup);
  await I.waitForElement(commonConfig.firstCommentXp);  
  await I.fillField(commonConfig.firstCommentXp, commentText);
  await I.waitForElement(commonConfig.saveButton);
  await I.retry(3).click(commonConfig.saveButton);
  await I.waitNumberOfVisibleElements(commonConfig.commentsCount, comments + 1);
}
