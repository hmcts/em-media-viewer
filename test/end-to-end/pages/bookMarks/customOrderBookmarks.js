'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");


module.exports = async function () {
  const I = this;
  
  await I.click('button#addBookmark');
  await I.fillField('input.bookmark__input', 'bookmark2');
  await I.click('button.bookmark__save');
  await I.moveCursorTo('div >tree-node:nth-child(1) > div.tree-node-level-1 > tree-node-drop-slot > div.node-drop-slot');
  await I.click('div.node-content-wrapper');
  await I.dragAndDrop('tree-node:nth-child(2) > div.tree-node-level-1 > tree-node-wrapper > div.node-wrapper > div.node-content-wrapper > tree-node-content > div.outlineItem', 'div >tree-node:nth-child(1) > div.tree-node-level-1 > tree-node-drop-slot > div.node-drop-slot');
  const screenshotName = Date.now() + 'bookmarkMoved' + '.png';
  await I.saveScreenshot(screenshotName, true);
  await I.wait(3);
}