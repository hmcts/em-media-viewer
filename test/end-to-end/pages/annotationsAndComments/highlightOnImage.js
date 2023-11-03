'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function (xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex) {
  const I = this;
  await I.click(commonConfig.drawBox)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.executeScript((xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex) => {
    const createMouseEvent = (typeArg, screenX, screenY, clientX, clientY) => {
      const mouseEvent = document.createEvent('MouseEvents');
      mouseEvent.initMouseEvent(typeArg, true, true, window, 1, screenX, screenY, clientX, clientY, false, false, false, false, 0, null);
      return mouseEvent;
    };

    const mouseDown = createMouseEvent('mousedown', 800, 800, 800, 800);
    const mouseMove = createMouseEvent('mousemove', screenX, screenY, xAxis, yAxis);
    const mouseUp = createMouseEvent('mouseup', 950, 800, 950, 800);
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

  await I.wait(testConfig.TestTimeToWait)
};

