'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  const visible = await I.grabNumberOfVisibleElements(commonConfig.mvPrintButton);
  if (!visible) {
    await I.retry(2).click(commonConfig.moreOptionsButton);
    await I.retry(3).click('.dropdown-menu #mvPrintBtn');
  }
  else {
    await I.click(commonConfig.mvPrintButton);
  }
  const screenshotName = Date.now() + 'print' + '.png';
  await I.saveScreenshot(screenshotName, true);
};
