'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  await I.click(commonConfig.zoomOut);
  await I.see('110%');
  await I.click(commonConfig.zoomIn);
  await I.see('100%');
};
