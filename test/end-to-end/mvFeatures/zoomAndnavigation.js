const testConfig = require('./../../config');
const {mvData} = require('../pages/common/constants.js');
const {pdfViewerPageNavigationTest, pdfViewerZoomInOutTest} = require("../helpers/mvCaseHelper");

Feature('Zoom & Navigation Feature');

Scenario('Pdf Viewer Zoom In & Out', async ({I}) => {
  await pdfViewerZoomInOutTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Image Viewer Zoom In & Out', async ({I}) => {
  await pdfViewerZoomInOutTest(I, mvData.CASE_ID, mvData.IMAGE_DOCUMENT);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios)

Scenario('Pdf viewer page navigation', async ({I}) => {
  await pdfViewerPageNavigationTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT, mvData.PAGE_NAVIGATION_NUMBER);

}).tag('@ci')
  .tag('@np')
  .tag('@xb')
  .retry(testConfig.TestRetryScenarios);

Scenario('Enable page navigation based on user input', async ({I}) => {
  await pdfViewerPageNavigationTest(I, mvData.CASE_ID, mvData.PDF_DOCUMENT, mvData.PAGE_NUMBER_TO_NAVIGATE);

}).tag('@xb')
  .tag('@ci')
  .retry(testConfig.TestRetryScenarios);
