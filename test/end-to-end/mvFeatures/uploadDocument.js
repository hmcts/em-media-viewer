const testConfig = require('./../../config');
const {ccdEvents} = require('../pages/common/constants.js');
const {uploadPdf, uploadJpeg, uploadWorDoc} = require("../helpers/mvCaseHelper");

Feature('DM Store Upload Document Scenarios');
// BeforeSuite(async ({I}) => caseId = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json'));

Scenario('Upload PDF Document', async ({I}) => {
  await uploadPdf(I, testConfig.CCDCaseID, ccdEvents.UPLOAD_DOCUMENT);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Dm Store Upload Image Scenario', async ({I}) => {
  await uploadJpeg(I, testConfig.CCDCaseID, ccdEvents.UPLOAD_DOCUMENT);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Dm Store Upload Word Document Scenario', async ({I}) => {
  await uploadWorDoc(I, testConfig.CCDCaseID, ccdEvents.UPLOAD_DOCUMENT);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios);
