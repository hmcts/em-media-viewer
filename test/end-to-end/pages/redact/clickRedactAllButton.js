'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  const countText = await I.retry(10).grabTextFrom(commonConfig.findRedactResultsCount);
  const countValueString = countText.replace('results founds', '')
  const countValue = Number(countValueString.trim());

  await I.checkElementExist(commonConfig.redactAllBtn)
  await I.click(commonConfig.redactAllBtn)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.retry(3).seeNumberOfElements(commonConfig.rectangleClass, countValue);
}


