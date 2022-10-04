const {Logger} = require('@hmcts/nodejs-logging');
const requestModule = require('request-promise-native');
const request = requestModule.defaults();
const fs = require('fs');
const testConfig = require('../../config.js');
const idamApi = require('./idamApi');
const s2sService = require('./s2sHelper');
const logger = Logger.getLogger('helpers/ccdDataStoreApi.js');
const env = testConfig.TestEnv;

async function createCaseInCcd(dataLocation = 'ccd-case-basic-data.json') {
  const saveCaseResponse = await createECMCase(dataLocation).catch(error => {
    console.log(error);
  });
  const caseId = JSON.parse(saveCaseResponse).id;
  logger.info('Created case==>:: %s', caseId);
  return caseId;
}

async function createECMCase(dataLocation = 'ccd-case-basic-data.json') {
  const authToken = await idamApi.getUserToken();
  const userId = await idamApi.getUserId(authToken);
  const serviceToken = await s2sService.getServiceToken();

  const ccdApiUrl = `http://ccd-data-store-api-${env}.service.core-compute-${env}.internal`;
  const ccdStartCasePath = `/caseworkers/${userId}/jurisdictions/EMPLOYMENT/case-types/Leeds/event-triggers/initiateCase/token`;
  const ccdSaveCasePath = `/caseworkers/${userId}/jurisdictions/EMPLOYMENT/case-types/Leeds/cases`;

  const startCaseOptions = {
    method: 'GET',
    uri: ccdApiUrl + ccdStartCasePath,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'ServiceAuthorization': `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    }
  };

  const startCaseResponse = await request(startCaseOptions);
  const eventToken = JSON.parse(startCaseResponse).token;

  const data = fs.readFileSync(dataLocation);
  const saveBody = {
    data: JSON.parse(data),
    event: {
      id: 'initiateCase',
      summary: 'Creating CCD Case',
      description: 'For Media Viewer Automation'
    },
    'event_token': eventToken
  };

  const saveCaseOptions = {
    method: 'POST',
    uri: ccdApiUrl + ccdSaveCasePath,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'ServiceAuthorization': `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  const saveCaseResponse = await request(saveCaseOptions);
  return saveCaseResponse;
}


module.exports = {
  createCaseInCcd,
  createECMCase,
};
