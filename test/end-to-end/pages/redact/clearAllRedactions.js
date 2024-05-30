'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;

  await I.clickRedactMenu();
  await I.click(commonConfig.clearAllRedaction);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.refreshPage();
  await I.waitForEnabled(commonConfig.assertEnvTestData, testConfig.TestTimeToWaitForText);
}
