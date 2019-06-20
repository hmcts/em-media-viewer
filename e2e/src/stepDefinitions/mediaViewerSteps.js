
let {Given, Then} = require('cucumber');
let NavigatePage = require('../pages/navigate.po').NavigatePage;
let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
global.expect = chai.expect;

Given('I am on Media Viewer Page', function () {
  let page = new NavigatePage();
  page.getHeaderText();
  page.goToNextPage();

});

Given('I enable toggle buttons', function () {
  console.log("I am here");
});

Then('I expect toolbar icons should appear', function () {

  console.log("I am here again");
});





