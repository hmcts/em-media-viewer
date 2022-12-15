'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.clearAllRedactions();
  await I.clickRedactMenu();
  await I.click(commonConfig.redactTextBtn);
  await I.redactText();

  await I.click(commonConfig.redactDrawBox);
  await I.dragAndDrop(commonConfig.redactTextCss, commonConfig.redactTextCss)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.redactionsPreview();
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.verifyWhetherTheRedactionAreVisibleOrNot();
}
