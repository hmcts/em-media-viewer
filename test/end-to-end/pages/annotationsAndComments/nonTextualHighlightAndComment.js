'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.highlightOnImage(900, 900, 900, 900, ['mousedown', 'mousemove', 'mouseup'], 'box-highlight', 0);
  await I.retry(2).click(commonConfig.commentPopup);
  await I.fillField(commonConfig.firstCommentXp, commonConfig.firstComment1);
  await I.retry(3).click(commonConfig.saveButton);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
