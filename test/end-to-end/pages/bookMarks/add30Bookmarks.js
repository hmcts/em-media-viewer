'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  let i = 0;

  for (i = 0; i < 31; i++) {
    await I.click(commonConfig.addBookmarkButton);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }

  const screenshotName = Date.now() + 'emptyBookmark' + '.png';
  await I.saveScreenshot(screenshotName, true);
}
