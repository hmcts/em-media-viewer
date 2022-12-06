'use strict';
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  await I.retry(2).click(commonConfig.addNewBtn);
  await I.retry(3).attachFile('#documentCollection_1_uploadedDocument', 'data/quote.jpg');
  await I.waitForEnabled('#documentCollection_1_uploadedDocument', testConfig.TestTimeToWaitForText);
  await I.fillField('#documentCollection_1_shortDescription', commonConfig.uploadImageDesc);
  await I.click(commonConfig.continue);
  await I.click(commonConfig.submitButton);
};
