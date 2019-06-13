import { NavigatePage } from '../pages/navigate.po';

// let NavigatePage = require('../pages/navigate.po');
// import {Given, Then} from 'cucumber';
// let chai = require('chai');
// let chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
// global.expect = chai.expect

const { Given, Then} = require('cucumber');
const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;

Given(/^User Navigates Media Viewer Application$/, function () {
  const page = new NavigatePage();
  page.goToNextPage();

});
Given(/^I enable toggle buttons$/, function () {
  console.log('I am in 2nd step');

});
Then(/^I expect toolbar icons should appear$/, function () {
  console.log('I am in 3nd step');

});
