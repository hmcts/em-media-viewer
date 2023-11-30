'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  await I.retry(3).click('#mvPrintBtn');
  const screenshotName = Date.now() + 'print' + '.png';
  await I.saveScreenshot(screenshotName, true);
};
