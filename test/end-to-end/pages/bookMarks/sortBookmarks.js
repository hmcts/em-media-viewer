'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const { assert, expect } = require('chai');

module.exports = async function () {
  const I = this;

  const visible = await I.grabNumberOfVisibleElements(commonConfig.sortBookmarkPosition);
  if (!visible) {
    console.log("skipping sort bookmarks test");
    return;
  }

  await I.click(commonConfig.moveDown);
  await I.addNamedBookmark('page2');

  await I.click(commonConfig.moveDown);
  await I.addNamedBookmark('page3');

  await I.click(commonConfig.moveUp);
  await I.click(commonConfig.moveUp);
  await I.addNamedBookmark('page1');

  let bookmarkNames = await collectBookmarkNames();
  assert.deepEqual(bookmarkNames, ['page2', 'page3', 'page1']);

  await I.click(commonConfig.sortBookmarkPosition);
  bookmarkNames = await collectBookmarkNames();
  assert.deepEqual(bookmarkNames, ['page1', 'page2', 'page3']);

  await I.click(commonConfig.sortBookmarkCustom);
  bookmarkNames = await collectBookmarkNames();
  assert.deepEqual(bookmarkNames, ['page2', 'page3', 'page1']);

  async function collectBookmarkNames() {
    let names = [];
    for (let i = 1; i < 4; i++) {
      let bookmarkName = await I.grabTextFrom(`(//cdk-nested-tree-node)[${i}]`);
      names.push(bookmarkName);
    }
    return names;
  }
}
