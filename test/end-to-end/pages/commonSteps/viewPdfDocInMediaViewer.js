'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.waitForEnabled(commonConfig.documentsTab, testConfig.TestTimeToWaitForText)
  await I.retry(5).click(commonConfig.documentsTab);
  await I.waitForText('example.pdf', testConfig.TestTimeToWaitForText);

  await I.retry(3).click(commonConfig.examplePdfLink);
  await I.wait(testConfig.TestTimeToWait);
  await I.switchToNextTab(1);
};
