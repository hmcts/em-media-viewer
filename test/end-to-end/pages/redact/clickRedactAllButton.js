'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const { assert } = require('chai')

module.exports = async function () {
  const I = this;
  const countText = await I.retry(10).grabTextFrom(commonConfig.findRedactResultsCount);
  await I.checkElementExist(commonConfig.redactAllBtn)
  await I.click(commonConfig.redactAllBtn)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  const countValueString = countText.replace('results founds', '')
  const countValue = Number(countValueString.trim());
  const retangleFound = await I.retry(10).grabHTMLFromAll(commonConfig.rectangleClass);
  assert.equal(retangleFound.length, countValue)
}


