'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function (comment, updatedComment) {
  const I = this;

  await I.retry(3).click(`//p[contains(text(), '${comment}')]`);
  await I.waitForElement(commonConfig.editButton);
  await I.click(commonConfig.editButton);
  await I.waitForElement(commonConfig.clearFiledXp);
  await I.clearField(commonConfig.clearFiledXp);
  await I.fillField(commonConfig.clearFiledXp, updatedComment);
  await I.click(commonConfig.saveButton);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.refreshPage();
};
