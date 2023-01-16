'use strict';
const {mvData} = require("../common/constants");
const testConfig = require('../../../config');

module.exports = async function () {
  const I = this;
  if (process.env.TEST_URL.includes(mvData.EXUI_ENV)) {
    await I.amOnPage(process.env.TEST_URL, testConfig.PageLoadTime);
  } else {
    await I.amOnPage(testConfig.TestUrl1, testConfig.PageLoadTime);
  }
  await I.waitForText('Sign in');
  await I.fillField('username', testConfig.TestEnvCWUser);
  await I.fillField('password', testConfig.TestEnvCWPassword);
  await I.click('input[value="Sign in"]');
  await I.waitForText('Case list', testConfig.TestTimeToWaitForText);
};
