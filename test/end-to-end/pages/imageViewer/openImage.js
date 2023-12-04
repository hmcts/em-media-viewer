'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const chai = require('chai');


module.exports = async function () {
  const I = this;
  await I.click(commonConfig.imageTabButton);
  await I.dontSee('Index');
};
