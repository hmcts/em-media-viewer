'use strict'

const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;

  await I.executeScript(async () => {
    const range = document.createRange();
    const matchingElement = document.getElementsByClassName('textLayer')[0].children[10];
    range.selectNodeContents(matchingElement);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const mouseUpEvent = document.createEvent('MouseEvents');
    mouseUpEvent.initMouseEvent('mouseup', true, true, window, 1, 844, 497, 937, 403, false, false, false, false, 0, null);
    const pageHandle = document.getElementsByClassName('textLayer')[0].children[10];
    pageHandle.dispatchEvent(mouseUpEvent);
  });

  while (await I.getBookmarksCount(commonConfig.highLightTextCount) !== 0) {
    await I.click(commonConfig.commentPopup.replace('Comment', 'Delete'));
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }
}
