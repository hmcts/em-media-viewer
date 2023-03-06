'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.click(commonConfig.mvHighLight);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  const startX = 330.03125;
  const startY = 362.3125;
  const endX = 400;
  const endY = 362.3125;
  const compeleted = await I.getTextSelectionByCoorindates(startX, startY, endX, endY)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
