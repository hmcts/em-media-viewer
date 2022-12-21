'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  await I.retry(2).click(commonConfig.multimediaAudioBtn);
  const screenshotName = Date.now() + 'audioTest' + '.png';
  await I.saveScreenshot(screenshotName, true);
};
