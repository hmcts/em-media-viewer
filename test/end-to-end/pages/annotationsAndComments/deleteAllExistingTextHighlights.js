'use strict'

const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;


  while (await I.getBookmarksCount(commonConfig.highLightTextCount) !== 0) {
    await I.click(commonConfig.highLightTextCount);
    await I.click(commonConfig.commentPopup.replace('Comment', 'Delete'));
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }
}
