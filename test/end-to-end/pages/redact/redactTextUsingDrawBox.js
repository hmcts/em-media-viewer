'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.click(commonConfig.redactDrawBox)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
};
