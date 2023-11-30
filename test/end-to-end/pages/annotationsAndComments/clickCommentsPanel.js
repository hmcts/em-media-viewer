'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.click(commonConfig.commentsBtnId);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
