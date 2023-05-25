'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const { assert } = require('chai');

module.exports = async function () {
  const I = this;

  //await I.openBookmarksPanel();
  await I.click(commonConfig.moveDown);
  await I.addNamedBookmark('page2');

  await I.click(commonConfig.moveDown);
  await I.addNamedBookmark('page3');

  await I.click(commonConfig.moveUp);
  await I.click(commonConfig.moveUp);
  await I.addNamedBookmark('page1');

  let customSorted = [];
  for (let i = 0; i < 2; i++) {
    let bookmarkName = await I.grabTextFrom(`(${commonConfig.bookmarksCount})[${i}]`);
    customSorted.push(bookmarkName);
  }

  assert.equal(customSorted, ['page2', 'page3', 'page1']);
   


//   const visible = await I.grabNumberOfVisibleElements(commonConfig.bookmarksToolbarButton);
//   if (visible) {
//     await I.click(commonConfig.bookmarksToolbarButton);
//     await I.wait(testConfig.BookmarksAndAnnotationsWait);
//     return;
//   }

}