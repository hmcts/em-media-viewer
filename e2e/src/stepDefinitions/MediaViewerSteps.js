import * as NavigatePage from "../pages/navigate.po";

let {defineSupportCode} = require('cucumber');
//let NavigatePage = require('../pages/navigate.po');
let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
global.expect = chai.expect;


defineSupportCode(function ({And, But, Given, Then, When}) {

  Given(/^User Navigates Media Viewer Application$/, function (callback) {
    let page = new NavigatePage();
    page.goToNextPage();
    callback.pending();
  });

  Given(/^I enable toggle buttons$/, function (callback) {
    callback.pending();
  });

  Then(/^I expect toolbar icons should appear$/, function (callback) {
    callback.pending();
  });
});
