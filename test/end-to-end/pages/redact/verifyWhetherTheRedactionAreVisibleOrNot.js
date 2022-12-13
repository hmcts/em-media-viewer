const {assert} = require('chai')
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {
  const I = this;
  let getRedactionsCount = await I.getBookmarksCount(commonConfig.redactionsCount);
  console.log('Redactions Count' + getRedactionsCount);
  assert.notEqual(getRedactionsCount, 0) // redactions count must be >= 0
}
