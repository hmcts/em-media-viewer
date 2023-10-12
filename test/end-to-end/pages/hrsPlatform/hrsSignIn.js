'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;

  await I.amOnPage(commonConfig.hrsCasePage);
  await I.seeInTitle(commonConfig.signInTitle);
  await I.fillField(commonConfig.usernameSelector, commonConfig.usernameInput);
  await I.fillField(commonConfig.passwordSelector, commonConfig.passwordInput);
  await I.scrollPageToBottom();
  await I.seeElement(commonConfig.signInBtn);
  await I.click(commonConfig.signInBtn);
}
