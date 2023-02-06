'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.clearAllRedactions();
  await I.clickRedactMenu();
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.click(commonConfig.redactPageButton);
  await I.click(commonConfig.redactTextCss);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.click(commonConfig.moveDown);
  await I.click(commonConfig.moveDown);
  await I.click(commonConfig.redactPageButton);
  await I.click(commonConfig.page3);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.redactionsPreview();
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.verifyWhetherTheRedactionAreVisibleOrNot();
}