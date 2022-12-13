'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  await I.clearAllRedactions();
  await I.clickRedactMenu();
  await I.click(commonConfig.redactTextBtn);
  await I.redactText();
  await I.redactionsPreview();
  await I.verifyWhetherTheRedactionAreVisibleOrNot();
}
