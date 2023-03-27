'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
let i = 0;

module.exports = async function () {

  const I = this;
  await I.clickRedactMenu();
  await I.click(commonConfig.clearAllRedaction);;
  await I.clickSearchFrom();
  await I.redactFillSearchInput();
  await I.clickRedactSearchButton();
  await I.clickRedactAllButton();
}
