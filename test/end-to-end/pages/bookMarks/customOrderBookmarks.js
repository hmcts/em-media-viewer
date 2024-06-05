'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");


module.exports = async function () {
  const I = this;

  await I.click(commonConfig.addBookmarkBtn);
  await I.fillField(commonConfig.bookmarkInputField, commonConfig.bookmarkName);
  await I.click(commonConfig.saveBookmark);
  await I.moveCursorTo(commonConfig.bookmark1Position);
  await I.click(commonConfig.bookmark1Card);
  await I.dragAndDrop('(//cdk-nested-tree-node)[2]', '(//cdk-nested-tree-node)[1]');
  const screenshotName = Date.now() + 'bookmarkMoved' + '.png';
  await I.saveScreenshot(screenshotName, true);
  await I.wait(3);
}
