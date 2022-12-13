'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;

  await I.click(commonConfig.previewBtn);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  const screenshotName = Date.now() + 'redactionCheck' + '.png';
  await I.saveScreenshot(screenshotName, true);

  console.assert(await I.getBookmarksCount(commonConfig.redactionsCount) > 0)
}
