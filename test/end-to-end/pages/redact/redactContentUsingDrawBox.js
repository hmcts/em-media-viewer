'use strict'

const testConfig = require("../../../config");
const commonConfig = require('../../data/commonConfig.json');

async function createMouseEvent(typeArg, screenX, screenY, clientX, clientY) {
  const mouseEvent = document.createEvent('MouseEvents');
  mouseEvent.initMouseEvent(typeArg, true, true, window, 1, screenX, screenY, clientX, clientY, false, false, false, false, 0, null);
  return mouseEvent;
}

module.exports = async function (xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex) {
  const I = this;
  await I.click(commonConfig.redactDrawBox)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.executeScript(async (xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex) => {

    console.log('Data:' + xAxis)
  // await browser.executeScript((xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex) => {

    const mouseDown = await createMouseEvent('mousedown', 500, 500, 500, 500);
    const mouseMove = await createMouseEvent('mousemove', screenX, screenY, xAxis, yAxis);
    const mouseUp = await createMouseEvent('mouseup', 750, 800, 750, 800);

    const selectedElement = document.getElementsByClassName(elementSelector)[elementIndex];

    if (eventList.includes('mousedown')) {
      selectedElement.dispatchEvent(mouseDown);
    }
    if (eventList.includes('mousemove')) {
      selectedElement.dispatchEvent(mouseMove);
    }
    if (eventList.includes('mouseup')) {
      selectedElement.dispatchEvent(mouseUp);
    }
  }, xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex);
}

