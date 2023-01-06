const testConfig = require('./../../config');
const {multiMediaAudioTest, multiMediaAudioPauseAndRewindTest} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Multimedia Audio & Video Feature');

Scenario('Check whether the audio player Play and Stop functions are working or not?', async ({I}) => {
  await multiMediaAudioTest(I, mvData.CASE_ID, mvData.AUDIO_MP3);

}).tag('@np')
  .retry(testConfig.TestRetryScenarios);

Scenario('Multimedia Audio Pause & Rewind', async ({I}) => {
  await multiMediaAudioPauseAndRewindTest(I, mvData.CASE_ID, mvData.AUDIO_MP3);

}).tag('@wip')
  .retry(testConfig.TestRetryScenarios);
