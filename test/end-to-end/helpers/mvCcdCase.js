const {Logger} = require('@hmcts/nodejs-logging');
const requestModule = require('request-promise-native');
const fs = require('fs');
const request = requestModule.defaults();
const testConfig = require('../../config.js');
const querystring = require('querystring');
const logger = Logger.getLogger('helpers/idamApi.js');
const totp = require("totp-generator");
const {expect} = require('chai');
const env = testConfig.TestEnv;
const dataLocation = require('../data/ccd-case-basic-data.json')
const location = 'Leeds';
const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal/lease`;
const username = testConfig.TestEnvCWUser;
const password = testConfig.TestEnvCWPassword;
const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net/loginUser`;
const getUserIdurl = `https://idam-api.${env}.platform.hmcts.net/details`;
const ccdApiUrl = `http://ccd-data-store-api-${env}.service.core-compute-${env}.internal`;
let case_id;


module.exports = async function createCcdCase() {

  const {I} = inject();
  let payload = querystring.stringify({
    username: `${username}`,
    password: `${password}`,
  })

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const authTokenResponse = await I.sendPostRequest(idamBaseUrl, payload, headers);
  expect(authTokenResponse.status).to.eql(200);
  const authToken = authTokenResponse.data.access_token;
  logger.debug(authToken);

  const oneTimepwd = totp(testConfig.TestS2SAuthSecret, {digits: 6, period: 30});
  // get s2s token
  console.log("checking OTP => :" + oneTimepwd);

  let s2sheaders = {
    'Content-Type': 'application/json'
  };
  let s2spayload = {
    'microservice': 'ccd_gw',
    'oneTimePassword': oneTimepwd
  }
  const s2sResponse = await I.sendPostRequest(s2sBaseUrl, s2spayload, s2sheaders);
  let serviceToken = s2sResponse.data;
  expect(s2sResponse.status).to.eql(200)
  logger.debug(serviceToken);

  let getIdheaders =
    {
      'Authorization': `Bearer ${authToken}`
    };
  const userDetails = await I.sendGetRequest(getUserIdurl, getIdheaders);
  const userId = userDetails.data.id

  console.log("checking userId =>" + userId)

  const ccdStartCasePath = `/caseworkers/${userId}/jurisdictions/EMPLOYMENT/case-types/${location}/event-triggers/initiateCase/token`;
  const ccdSaveCasePath = `/caseworkers/${userId}/jurisdictions/EMPLOYMENT/case-types/${location}/cases`;

  let initiateCaseUrl = ccdApiUrl + ccdStartCasePath
  let initiateCaseHeaders = {
    'Authorization': `Bearer ${authToken}`,
    'ServiceAuthorization': `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  }

  let initiateCaseResponse = await I.sendGetRequest(initiateCaseUrl, initiateCaseHeaders);
  expect(initiateCaseResponse.status).to.eql(200);

  const initiateEventToken = initiateCaseResponse.data.token;
  console.log("checking eventToken" + initiateEventToken);

  // start case creation
  let createCasetemp = {
    data: dataLocation,
    event: {
      id: 'initiateCase',
      summary: 'Creating Case',
      description: 'For CCD E2E Test'
    },
    'event_token': initiateEventToken
  };
  let createCaseUrl = ccdApiUrl + ccdSaveCasePath
  const createCaseHeaders = {
    'Authorization': `Bearer ${authToken}`,
    'ServiceAuthorization': `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  let createCasebody = `${JSON.stringify(createCasetemp)}`
  const createCaseResponse = await I.sendPostRequest(createCaseUrl, createCasebody, createCaseHeaders);

  expect(createCaseResponse.status).to.eql(201);
  case_id = createCaseResponse.data.id
  console.log("checking case_id" + case_id);
  return case_id;
}
