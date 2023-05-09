'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;

  const visible = await I.grabNumberOfVisibleElements(commonConfig.bookmarksToolbarButton);
  if (visible) {
    await I.click(commonConfig.bookmarksToolbarButton);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    return;
  }

  await I.click(commonConfig.bookMarksIndex);
  await I.wait(testConfig.BookmarksAndAnnotationsWait)
  await I.click(commonConfig.viewBookmark);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

}
