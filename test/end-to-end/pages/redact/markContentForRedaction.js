'use strict'

module.exports = async function (redactText) {
  const I = this;
  // await I.clearAllRedactions();
  await I.clickRedactMenu();
  await I.redactContentUsingDrawBox('950', '950', '950', '950', ['mousedown', 'mousemove', 'mouseup'], 'box-highlight', 0);
  await I.redactionsPreview();
  await I.verifyWhetherTheRedactionAreVisibleOrNot();

}
