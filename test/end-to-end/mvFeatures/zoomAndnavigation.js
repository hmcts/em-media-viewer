const testConfig = require('./../../config');
const {ccdEvents, mvData} = require('../pages/common/constants.js');
const {pdfViewerPageNavigationTest, pdfViewerZoomInOutTest} = require("../helpers/mvCaseHelper");

Feature('Zoom & Navigation Feature');

Scenario('PDF Viewer Zoom In/Out', async ({I}) => {
  await pdfViewerZoomInOutTest(I, mvData.CASE_ID, ccdEvents.UPLOAD_DOCUMENT, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Image Viewer Zoom In/Out', async ({I}) => {
  await pdfViewerZoomInOutTest(I, mvData.CASE_ID, ccdEvents.UPLOAD_DOCUMENT, mvData.IMAGE_DOCUMENT);

}).tag('@nightly')
  .retry(testConfig.TestRetryScenarios)

Scenario('Pdf viewer page navigation', async ({I}) => {
  await pdfViewerPageNavigationTest(I, mvData.CASE_ID);

}).tag('@ci')
  .tag('@nightly')
  .tag('@xb')
  .retry(testConfig.TestRetryScenarios);

Scenario('Enable page navigation with in a file', async ({I}) => {
  await pdfViewerPageNavigationTest(I, mvData.CASE_ID);

}).tag('@xb')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);
