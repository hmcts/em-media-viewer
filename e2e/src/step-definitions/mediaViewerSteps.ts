
import {Given, Then} from 'cucumber';
import { NavigatePage } from '../pages/navigate.po';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

Given('I am on Media Viewer Page',  async () => {
  const page = new NavigatePage();
  page.preparePage();
  page.goToNextPage();

});

//
// Given(/^I am on Media Viewer Page$/, function () {
//   const page = new NavigatePage();
//   page.navigateTo();
//   page.goToNextPage();
// });


Given('I enable toggle buttons', function () {
  console.log('I am here');
});

Then('I expect toolbar icons should appear', function () {

  console.log('I am here again');
});





