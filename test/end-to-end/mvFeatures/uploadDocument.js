const testConfig = require('./../../config');
const {createCaseInCcd} = require("../helpers/ccdDataStoreApi");
const {ccdEvents} = require('../pages/common/constants.js');
const {uploadPdf, uploadJpeg, uploadWorDoc} = require("../helpers/mvCaseHelper");
let caseId;

Feature('DM Store Upload Document Scenarios');
BeforeSuite(async ({I}) => caseId = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json'));

Scenario('Upload PDF Document', async ({I}) => {
  await uploadPdf(I, caseId, ccdEvents.UPLOAD_DOCUMENT);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Dm Store Upload Image Scenario', async ({I}) => {
  await uploadJpeg(I, caseId, ccdEvents.UPLOAD_DOCUMENT);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Dm Store Upload Word Document Scenario', async ({I}) => {
  await uploadWorDoc(I, caseId, ccdEvents.UPLOAD_DOCUMENT);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios);
