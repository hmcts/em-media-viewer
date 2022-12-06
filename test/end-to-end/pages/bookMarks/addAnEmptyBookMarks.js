'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.click(commonConfig.addBookmarkButton);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.click(commonConfig.addBookmarkButton);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  const screenshotName = Date.now() + 'emptyBookmark' + '.png';
  await I.saveScreenshot(screenshotName, true);
}
