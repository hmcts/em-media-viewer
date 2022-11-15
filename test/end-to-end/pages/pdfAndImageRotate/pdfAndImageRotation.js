'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  await I.retry(2).click(commonConfig.rotateRightBtn);
  await I.retry(3).click(commonConfig.rotateLeftBtn);
  const screenshotName = Date.now() + 'download' + '.png';
  await I.saveScreenshot(screenshotName, true);
};
