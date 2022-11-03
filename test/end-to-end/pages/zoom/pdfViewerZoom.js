'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {

  const I = this;

  await I.click(commonConfig.documentsTab);
  await I.waitForText('example.pdf', testConfig.TestTimeToWaitForText);
  await I.click(commonConfig.examplePdfLink);
  await I.wait(5);
  await I.switchToNextTab(1);
  await I.click(commonConfig.zoomOut);
  await I.see('110%');
  await I.click(commonConfig.zoomIn);
  await I.see('100%');
};
