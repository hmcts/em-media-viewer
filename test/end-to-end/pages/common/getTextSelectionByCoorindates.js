'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function (startX, startY, endX, endY) {
  const I = this;
  const completed = await I.executeScript(function (startX, startY, endX, endY) {
    const sourceElement = document.elementFromPoint(startX, startY);
    const targetElement = document.elementFromPoint(endX, endY);

    const range = document.createRange();
    range.setStartBefore(sourceElement);
    range.setEndAfter(targetElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    const windowSelection = window.getSelection();
    const windowRange = windowSelection.getRangeAt(0);
    const rects = windowRange.getClientRects();

    const rect = rects[0];
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const element = document.elementFromPoint(x, y);

    const mousedownEvent = new MouseEvent('mousedown', {
      view: window,
      bubbles: true,
      cancelable: true
    });

    element.dispatchEvent(mousedownEvent);
    const mouseupEvent = new MouseEvent('mouseup', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(mouseupEvent);
    return true;

  }, startX, startY, endX, endY);


  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  return completed;
}
