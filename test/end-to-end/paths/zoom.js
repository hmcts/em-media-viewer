const testConfig = require('./../../config');
const {ccdEvents, mvData} = require('../pages/common/constants.js');
const {pdfViewerZoomInOutTest} = require("../helpers/mvCaseHelper");
let caseId;

Feature('Zoom Feature');

Scenario('PDF Viewer Zoom In/Out', async ({I}) => {
  await pdfViewerZoomInOutTest(I, caseId, ccdEvents.UPLOAD_DOCUMENT, mvData.PDF_DOCUMENT);

}).tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Image Viewer Zoom In/Out', async ({I}) => {
  await pdfViewerZoomInOutTest(I, caseId, ccdEvents.UPLOAD_DOCUMENT, mvData.IMAGE_DOCUMENT);

}).tag('@nightly')
  .retry(testConfig.TestRetryScenarios)
