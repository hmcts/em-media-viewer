'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {

  const I = this;
  await I.waitForText('Zoom', testConfig.TestTimeToWaitForText);
  await I.click(commonConfig.zoomOut);
  await I.see('110%');
  await I.click(commonConfig.zoomIn);
  await I.see('100%');
};
