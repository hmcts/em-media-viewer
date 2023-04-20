'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  const visible = await I.grabNumberOfVisibleElements(commonConfig.redactMenu);
  if (!visible) {
    await I.click(commonConfig.moreOptionsButton)
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.redactMenuDropdown);
  }
  else {
    await I.click(commonConfig.redactMenu);
  }
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
