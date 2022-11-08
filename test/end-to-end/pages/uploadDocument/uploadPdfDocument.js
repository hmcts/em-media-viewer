'use strict';
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {

  const I = this;
  await I.see('Upload Document');
  await I.retry(2).click(commonConfig.addNewBtn);
  await I.retry(3).attachFile('#documentCollection_0_uploadedDocument', 'data/example.pdf');
  await I.waitForEnabled('#documentCollection_0_uploadedDocument', testConfig.TestTimeToWaitForText);
  await I.fillField('#documentCollection_0_shortDescription', commonConfig.shortDescription);
  await I.click(commonConfig.continue);
  await I.click(commonConfig.submitButton);
};
