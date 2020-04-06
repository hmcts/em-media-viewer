import {browser, by, element, ElementArrayFinder, ElementFinder,} from 'protractor';
import {AppPage} from './app.po';
import {By} from '@angular/platform-browser';
import {expect} from 'chai';


export class CommentsPanelPage extends AppPage {
  //commentsToggleButton : ElementFinder = element(by.id('toggle-comments-panel'));

  commentsToggleButton : ElementFinder      = element(by.xpath("//button[@id=\'toggle-comments-panel\' and @title=\'Toggle Comments Panel\']"));
  commentsTabButton     : ElementFinder     = element(by.xpath(("//div[@class=\'govuk-tabs commentSummaryHeader\']/ul/li[1]/a")));
  filterTabButton       : ElementFinder     = element(by.xpath(("//div[@class=\'govuk-tabs commentSummaryHeader\']/ul/li[2]/a")));
  searchTabButton       : ElementFinder     = element(by.xpath(("//div[@class=\'govuk-tabs commentSummaryHeader\']/ul/li[3]/a")));
  collateCommentsButton : ElementFinder     = element(by.xpath("//button[@id=\'commentSummary\']"));
  commentsNotAvailable  : ElementFinder     = element(by.xpath("//div[@id=\'comment-container\'/h3"));
  courtBundleName       : ElementFinder     = element(by.xpath("//div[@id=\'comment-container\'/h2"));
  overlayCloseButton    : ElementFinder     = element(by.buttonText("Close"));
  searchInputField      : ElementFinder      = element(by.id('search-comments-input'));
  searchButton          : ElementFinder     = element(by.xpath('//button[@class=\'govuk-button comment-search\']'));
  searchResult          : ElementFinder     = element(by.css('#comment-search'));

  async clickShowCommentsToggleIcon(){
     await this.commentsToggleButton.click();

  }

  async clickOnCommentsTab(){
    await browser.sleep(1000);
    this.commentsTabButton.getText().then( function ( name ) {
      expect(name).equal('Comments');

    })
    await this.commentsTabButton.click();
  }

  async clickOnFilterTab(){
    this.filterTabButton.getText().then( function ( name ) {
      expect(name).equal('Filter');

    })
    await this.filterTabButton.click();
  }

  async clickOnSearchTab(){
    await browser.sleep(5000);
    await this.searchTabButton.click();
    await browser.sleep(5000);
 }

  async performSearch(){
    let searchText = "asdfasdfadsfasf";

    await browser.sleep(1000);
    await this.searchInputField.sendKeys(searchText);
    await browser.sleep(1000);

    await this.searchButton.click();
    console.log("Search button clicked now ......")
    await browser.sleep(2000);
   this.hideCommentsToggle();
  }

  async clickOnCollateCommentsButton() {
    await browser.sleep(2000);
    await this.collateCommentsButton.click();
    await browser.sleep(3000);
  }

  async hideCommentsToggle(){
    await this.commentsToggleButton.click();
 }

 async assertToggleButtonText()  {
   await this.commentsToggleButton.getText().then( function(toggleIconText) {
     expect(toggleIconText).equal('Hide comments');
   })
 }

  async assertSearchResultText(searchResultStringOnPanel :String)  {
    await this.searchResult.getText().then( function(text) {
      expect(text.trim()).equal(searchResultStringOnPanel);
    })
  }

  async assertNoCommentRowsPresent() {
    this.commentsNotAvailable.getText().then( function ( name ) {
      expect(name).equal('No comments available');

    })

    this.courtBundleName.getText().then( function (name ) {
      expect(name).equal('Bury Metropolitan Council:  TEST COURT BUNDLE');
    })

  }

  async closeOverlayPanel() {
    await browser.sleep(2000);
    await this.overlayCloseButton.click();
    await browser.sleep(2000);

  }
}
