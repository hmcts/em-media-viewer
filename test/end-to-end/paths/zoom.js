const testConfig = require('./../../config');
const {createCaseInCcd} = require("../helpers/ccdDataStoreApi");
const {ccdEvents, mvData} = require('../pages/common/constants.js');
const {pdfViewerZoomInOutTest} = require("../helpers/mvCaseHelper");
let caseId;

Feature('Zoom Feature');

BeforeSuite(async ({I}) => caseId = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json'));

Scenario('PDF Viewer Zoom In/Out', async ({I}) => {
  await pdfViewerZoomInOutTest(I, caseId, ccdEvents.UPLOAD_DOCUMENT, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Image Viewer Zoom In/Out', async ({I}) => {
  await pdfViewerZoomInOutTest(I, caseId, ccdEvents.UPLOAD_DOCUMENT, mvData.IMAGE_DOCUMENT);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios)
