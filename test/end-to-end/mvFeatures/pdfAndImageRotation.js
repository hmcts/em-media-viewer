const testConfig = require('./../../config');
const {ccdEvents, mvData} = require('../pages/common/constants.js');
const {pdfAndImageRotationTest} = require("../helpers/mvCaseHelper");

Feature('Pdf & Image Rotation');

Scenario('PDF Viewer Zoom In/Out', async ({I}) => {
  await pdfAndImageRotationTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@Test88')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Image Viewer Zoom In/Out', async ({I}) => {
  await pdfAndImageRotationTest(I, mvData.CASE_ID, mvData.IMAGE_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios)
