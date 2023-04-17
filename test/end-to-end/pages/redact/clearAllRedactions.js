'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const {mvData} = require("../common/constants");

module.exports = async function () {
  const I = this;

  const url = await I.grabCurrentUrl();
  if (url.includes(mvData.PREVIEW_ENV)) {
    await I.click(commonConfig.moreOptionsButton)
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }

  await I.click(commonConfig.redactMenu);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.click(commonConfig.clearAllRedaction);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.refreshPage();
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
