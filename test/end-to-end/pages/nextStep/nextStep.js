'use strict';
const testConfig = require('../../../config');
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function (nextStep, webDriverWait) {
  const I = this;
  await I.waitForEnabled({css: '#next-step'}, testConfig.TestTimeToWaitForText);
  await I.retry(5).selectOption('#next-step', nextStep);
  await I.waitForEnabled(commonConfig.goButton, testConfig.TestTimeToWaitForText);
  await I.waitForNavigationToComplete(commonConfig.goButton, webDriverWait);
};