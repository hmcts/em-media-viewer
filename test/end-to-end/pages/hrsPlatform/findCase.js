'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;

  await I.seeInTitle(commonConfig.findCasePageTitle)
  await I.waitForElement(commonConfig.recordingReferenceField, 5);
  await I.fillField(commonConfig.recordingReferenceField, commonConfig.recordingReference);
  await I.click(commonConfig.applyFiltersBtn);
  await I.seeElement(commonConfig.oneResultCheck);
  await I.click(commonConfig.caseLink);
}
