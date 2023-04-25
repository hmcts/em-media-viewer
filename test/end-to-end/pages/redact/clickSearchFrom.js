'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.checkElementExist(commonConfig.redactFromSearchBtn)
  await I.click(commonConfig.redactFromSearchBtn)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
