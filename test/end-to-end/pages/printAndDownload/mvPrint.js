'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  const visible = await I.grabNumberOfVisibleElements(commonConfig.mvPrint);
  if (!visible) {
    await I.click(commonConfig.moreOptionsButton)
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.mvPrint);
  }
  else {
    await I.click(commonConfig.mvPrint);
  }
  const screenshotName = Date.now() + 'print' + '.png';
  await I.saveScreenshot(screenshotName, true);
};
