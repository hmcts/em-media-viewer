'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  
  await I.retry(2).click(commonConfig.rotateRightBtn);

  await I.addComments(commonConfig.firstComment1);

  await I.retry(3).click(commonConfig.rotateLeftBtn);
}
