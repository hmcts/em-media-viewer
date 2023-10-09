'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;

  await I.click(commonConfig.caseHearingFileTab);
  await I.seeTextEquals(commonConfig.nextStepCheck, commonConfig.nextStepCheckElement);
  await I.selectOption(commonConfig.nextStepDropdown, commonConfig.shareHearingFileOption);
  await I.click(commonConfig.goBtn2);
  await I.seeTextEquals(commonConfig.shareFileCheck, commonConfig.shareFileCheckElement);
  await I.clearField(commonConfig.recipientEmailField);
  await I.fillField(commonConfig.recipientEmailField, commonConfig.recipientEmailAddress);
  await I.click(commonConfig.submitBtn);
  await I.click(commonConfig.submitBtn);
  await I.waitForText(commonConfig.fileSharedConfirmationText, 5);
  await I.click(commonConfig.signOutBtn);
  await I.fillField(commonConfig.usernameSelector, commonConfig.recipientEmailAddress);
  await I.fillField(commonConfig.passwordSelector, commonConfig.passwordInput);
  await I.scrollPageToBottom();
  await I.click(commonConfig.signInBtn);
}
