'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  const visible = await I.grabNumberOfVisibleElements(commonConfig.commentsBtn);
  if (!visible) {
    await I.click(commonConfig.moreOptionsButton)
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.commentsBtnDropdown);
  }
  else {
    await I.click(commonConfig.commentsBtn);
  }
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
