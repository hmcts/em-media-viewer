'use strict'

const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;

  await I.openBookmarksPanel();

  while (await I.getBookmarksCount(commonConfig.bookmarksCount) !== 0) {
    await I.click(commonConfig.deleteBookmarkCss);
  }
}
