const testConfig = require('./../../config');
const {createCaseInCcd} = require("../helpers/ccdDataStoreApi");
const {pdfViewerZoomInOut} = require("../helpers/mvCaseHelper");
const {ccdEvents, mvData} = require('../pages/common/constants.js');
const {pdfViewerPageNavigationTest} = require("../helpers/mvCaseHelper");
let caseId;

Feature('Navigation & Zoom Feature Scenarios');

BeforeSuite(async ({I}) => caseId = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json'));

Scenario('Pdf viewer page navigation using move-up & move down buttons', async ({I}) => {
  await pdfViewerPageNavigationTest(I, caseId, ccdEvents.UPLOAD_DOCUMENT);

}).tag('@ci')
  .tag('@nightly')
  .tag('@xb')
  .retry(testConfig.TestRetryScenarios);

Scenario('Enable page navigation with in a file', async ({I}) => {
  await pdfViewerPageNavigationTest(I, caseId, ccdEvents.UPLOAD_DOCUMENT);

}).tag('@xb')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('PDF Viewer Zoom In/Out', async ({I}) => {
  await pdfViewerZoomInOut(I, caseId, ccdEvents.UPLOAD_DOCUMENT, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Image Viewer Zoom In/Out', async ({I}) => {
  await pdfViewerZoomInOut(I, caseId, ccdEvents.UPLOAD_DOCUMENT, mvData.IMAGE_DOCUMENT);

}).tag('@nightly')
  .retry(testConfig.TestRetryScenarios)
