import {browser, by, element, ElementArrayFinder, ElementFinder, } from 'protractor';
import {AppPage} from './app.po';
import {By} from '@angular/platform-browser';
import {expect} from 'chai';


export class CommentsPanelPage extends AppPage {
  commentsToggleButton: ElementFinder     =   element(by.id('mvCommentsBtn'));
  commentTabs: ElementArrayFinder = element(by.css('.commentSummaryHeader ul')).all(by.css('li'));
  commentsTabButton: ElementFinder = this.commentTabs.get(0).element(by.css('a'));
  filterTabButton: ElementFinder = this.commentTabs.get(1).element(by.css('a'));
  searchTabButton: ElementFinder     =   this.commentTabs.get(2).element(by.css('a'));
  collateCommentsButton: ElementFinder     =   element(by.id('commentSummary'));
  commentsContainerHeader: ElementFinder     =   element(by.id('comment-container')).element(by.css('h2'));
  commentsNotAvailable: ElementFinder     =   element(by.id('comment-container')).element(by.css('h2'));
  courtBundleName: ElementFinder     =   element(by.id('comment-container')).element(by.css('h2'));
  overlayCloseButton: ElementFinder     =   element(by.buttonText('Close'));
  searchInputField: ElementFinder     =   element(by.id('search-comments-input'));
  searchButton: ElementFinder     =   element(by.css('mv-comment-search button'));
  searchResult: ElementFinder     =   element(by.css('p.comment-search .comment-search__item'));
  noMatchSearchResult: ElementFinder     =   element(by.css('p.comment-search__item'));

    async clickCommentsToggleIcon() {
     await this.commentsToggleButton.click();
  }

  async clickOnCommentsTab() {
    await this.commentsTabButton.click();
  }

  async clickOnFilterTab() {
    const result  = await this.getFilterTabButtonText();
    expect(result).to.equal('Filter');
    await this.filterTabButton.click();
  }

  async clickOnSearchTab() {
    await this.searchTabButton.click();
 }

  async performSearch(searchText: string) {
    await this.enterTextInSearchBox(searchText);
    await this.clickSearch();
  }

  async  enterTextInSearchBox(text: string) {
    await this.searchInputField.sendKeys(text);
  }

  async  clickSearch() {
    await this.searchButton.click();
  }

  async clickOnCollateCommentsButton() {
    await this.collateCommentsButton.click();
  }

  async hideCommentsToggle() {
    await this.commentsToggleButton.click();
 }

 async assertToggleButtonText()  {
   const result  = await this.getToggleButtonText();
   expect(result).to.equal('Hide comments');
 }

  async assertSearchResultText(searchResultStringOnPanel: String)  {
    const result  = await this.searchResult.getText();
    expect(result.trim()).to.equal(searchResultStringOnPanel.trim());
  }

  async assertNoMatchSearchResultText(searchResultStringOnPanel: String)  {
    const result  = await this.noMatchSearchResult.getText();
    expect(result.trim()).to.equal(searchResultStringOnPanel.trim());
  }

  async assertNoCommentRowsPresent() {
    const result  = await this.commentsContainerHeader.getText();
    expect(result).to.equal('No comments available');
    const courtBundleName  = await this.courtBundleName.getText();
    expect(courtBundleName).to.equal('Bury Metropolitan Council:  TEST COURT BUNDLE');
  }

  async assertCommentSummaryPresent() {
    const result  = await this.commentsContainerHeader.getText();
    expect(result).to.equal('Bury Metropolitan Council: TEST COURT BUNDLE');
  }

  async closeOverlayPanel() {
    await this.overlayCloseButton.click();
  }

  async getFilterTabButtonText() {
    return (await this.filterTabButton.getText());
  }

  async getToggleButtonText() {
    return (await this.commentsToggleButton.getText());
  }

}
