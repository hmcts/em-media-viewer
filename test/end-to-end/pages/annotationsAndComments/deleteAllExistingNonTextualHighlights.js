'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
let i = 0;

module.exports = async function () {
  const I = this;
  await I.highlightOnImage(900, 900, 900, 900, ['mousedown', 'mousemove', 'mouseup'], 'box-highlight', 0);

  while (i < await I.getBookmarksCount(commonConfig.redactionsCount)) {
    await I.click(commonConfig.redactionsCount);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.deleteRedactionsXp);
  }
  await I.refreshPage();
}
