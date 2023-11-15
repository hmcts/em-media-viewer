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
  await I.dragAndDrop('tree-node:nth-child(2) > div.tree-node-level-1 > tree-node-wrapper > div.node-wrapper > div.node-content-wrapper > tree-node-content > div.outlineItem', 'div >tree-node:nth-child(1) > div.tree-node-level-1 > tree-node-drop-slot > div.node-drop-slot');
  const screenshotName = Date.now() + 'bookmarkMoved' + '.png';
  await I.saveScreenshot(screenshotName, true);
  await I.wait(3);
}