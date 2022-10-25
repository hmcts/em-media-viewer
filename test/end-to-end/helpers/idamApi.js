const {Logger} = require('@hmcts/nodejs-logging');
const requestModule = require('request-promise-native');
const request = requestModule.defaults();
const testConfig = require('../../config.js');
const logger = Logger.getLogger('helpers/idamApi.js');
const env = testConfig.TestEnv;
const {I} = inject();

const username = testConfig.TestEnvCWUser;
const password = testConfig.TestEnvCWPassword;
const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net/loginUser`;
const getUserIdurl = `https://idam-api.${env}.platform.hmcts.net/details`;

async function getUserToken() {

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
  logger.info ("IDAM Token::==>" +authToken);
  return authToken;
}

async function getUserId(authToken) {
  let getIDAMUserID =
    {
      'Authorization': `Bearer ${authToken}`
    };
  const userDetails = await I.sendGetRequest(getUserIdurl, getIDAMUserID);
  const userId = userDetails.data.id;
  console.log("IDAM User ID:: =>" + userId);
  return userId;
}

module.exports = {
  getUserToken,
  getUserId
};
