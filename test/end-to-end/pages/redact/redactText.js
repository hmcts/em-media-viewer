'use strict'
const testConfig = require("../../../config");

module.exports = async function (redactText) {
  const I = this;

  await I.executeScript(async () => {
    const range = document.createRange();
    const matchingElement = document.getElementsByClassName('textLayer')[0].children[15];
    range.selectNodeContents(matchingElement);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const mouseUpEvent = document.createEvent('MouseEvents');
    mouseUpEvent.initMouseEvent('mouseup', true, true, window, 1, 844, 497, 937, 403, false, false, false, false, 0, null);
    const pageHandle = document.getElementsByClassName('textLayer')[0].children[15];
    pageHandle.dispatchEvent(mouseUpEvent);
  });
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
}
