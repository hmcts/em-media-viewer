'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.click(commonConfig.documentsTab);
  await I.waitForText('example.pdf', testConfig.TestTimeToWaitForText);

  await I.click(commonConfig.examplePdfLink);
  await I.wait(testConfig.TestTimeToWait);
  await I.switchToNextTab(1);
};
