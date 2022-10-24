const {Logger} = require('@hmcts/nodejs-logging');
const requestModule = require('request-promise-native');
const request = requestModule.defaults();
const testConfig = require('../../config.js');
const logger = Logger.getLogger('helpers/s2sHelper.js');
const env = testConfig.TestEnv;
const {I} = inject();
const {expect} = require('chai');

async function getServiceToken() {
  const serviceSecret = testConfig.TestS2SAuthSecret;
  const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal/lease`;

  const oneTimePassword = require('otp')({
    secret: serviceSecret
  }).totp();

  console.log("checking OTP => :" + oneTimePassword);

  let s2sHeaders = {
    'Content-Type': 'application/json'
  };
  let s2sPayload = {
    'microservice': 'ccd_gw',
    'oneTimePassword': oneTimePassword
  }
  const s2sResponse = await I.sendPostRequest(s2sBaseUrl, s2sPayload, s2sHeaders);
  let serviceToken = s2sResponse.data;
  expect(s2sResponse.status).to.eql(200)
  logger.info("S2S Service Token==>::" + serviceToken);
  return serviceToken;
}

module.exports = {
  getServiceToken
}
