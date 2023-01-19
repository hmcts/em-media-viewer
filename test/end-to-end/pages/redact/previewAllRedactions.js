'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
let i = 0;

module.exports = async function () {
  const I = this;
  await I.clickRedactMenu();

  await I.redactionsPreview();
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.refreshPage();
}
