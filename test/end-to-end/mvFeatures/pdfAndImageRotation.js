const testConfig = require('./../../config');
const {mvData} = require('../pages/common/constants.js');
const {pdfAndImageRotationTest} = require("../helpers/mvCaseHelper");

Feature('Pdf & Image Rotation Feature');

Scenario('Rotate Pdf viewer document', async ({I}) => {
  await pdfAndImageRotationTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Rotate Image viewer document', async ({I}) => {
  await pdfAndImageRotationTest(I, mvData.CASE_ID, mvData.IMAGE_DOCUMENT);

}).tag('@nightly')
  .retry(testConfig.TestRetryScenarios)
