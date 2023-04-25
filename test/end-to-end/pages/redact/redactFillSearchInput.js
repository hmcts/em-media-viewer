'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.retry(2).click(commonConfig.redactSearchInput);
  await I.fillField(commonConfig.redactSearchInput, commonConfig.redactSearchInputText);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
