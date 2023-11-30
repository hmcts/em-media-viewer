'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  const visible = await I.grabNumberOfVisibleElements(commonConfig.mvDownload);
  if (!visible) {
    await I.click(commonConfig.moreOptionsButton)
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.mvDownload);
  }
  else {
    await I.click(commonConfig.mvDownload);
  }
  const screenshotName = Date.now() + 'download' + '.png';
  await I.saveScreenshot(screenshotName, true);
};
