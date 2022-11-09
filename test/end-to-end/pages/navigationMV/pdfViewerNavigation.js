'use strict'
const commonConfig = require('../../data/commonConfig.json');
const {mvData} = require("../common/constants");

module.exports = async function () {
  const I = this;
  await I.retry(2).click(commonConfig.moveDown);
  await I.seeInField(commonConfig.pageNumber, mvData.PAGE_NAVIGATION_NUMBER);
  await I.retry(3).click(commonConfig.moveUp);
};
