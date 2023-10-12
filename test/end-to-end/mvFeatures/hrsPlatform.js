const testConfig = require('./../../config');
const {
  hrsUserJourneyTest
} = require("../helpers/mvCaseHelper");
const { mvData } = require('../pages/common/constants.js');

Feature('HRS Platform Feature');

Scenario('HRS User Journey', async ({ I }) => {
  await hrsUserJourneyTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);