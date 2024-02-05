'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  const visible = await I.grabNumberOfVisibleElements(commonConfig.mvDownloadButton);
  if (!visible) {
    await I.retry(2).click(commonConfig.moreOptionsButton);
    await I.retry(3).click('.dropdown-menu #mvDownloadBtn');
  }
  else {
    await I.click(commonConfig.mvDownloadButton);
  }
  const screenshotName = Date.now() + 'download' + '.png';
  await I.saveScreenshot(screenshotName, true);
};
