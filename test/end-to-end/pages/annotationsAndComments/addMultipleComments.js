'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.highlightPdfText();
  await I.retry(2).click(commonConfig.commentPopup);
  await I.fillField(commonConfig.firstCommentXp, commonConfig.firstComment1);
  await I.retry(3).click('//button[@class="govuk-button" and contains(text(), "Save")]');
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
