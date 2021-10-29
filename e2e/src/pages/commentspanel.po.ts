import {browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import {AppPage} from './app.po';
import {By} from '@angular/platform-browser';
import {expect} from 'chai';
import {GenericMethods} from '../utils/genericMethods';

const genericMethods = new GenericMethods();

export class CommentsPanelPage extends AppPage {
  commentsToggleButton: ElementFinder = element(by.id('mvCommentsBtn'));
  commentTabs: ElementArrayFinder = element(by.css('.commentSummaryHeader ul')).all(by.css('li'));
  commentsTabButton: ElementFinder = this.commentTabs.get(0).element(by.css('a'));
  filterTabButton: ElementFinder = this.commentTabs.get(1).element(by.css('a'));
  searchTabButton: ElementFinder = this.commentTabs.get(2).element(by.css('a'));
  collateCommentsButton: ElementFinder = element(by.id('commentSummary'));
  commentsContainerHeader: ElementFinder = element(by.id('comment-container')).element(by.css('h2'));
  commentsNotAvailable: ElementFinder = element(by.id('comment-container')).element(by.css('h2'));
  courtBundleName: ElementFinder = element(by.id('comment-container')).element(by.css('h2'));
  overlayCloseButton: ElementFinder = element(by.buttonText('Close'));
  searchInputField: ElementFinder = element(by.id('search-comments-input'));
  searchButton: ElementFinder = element(by.css('mv-comment-search button'));
  searchResult: ElementFinder = element(by.css('p.comment-search .comment-search__item'));
  noMatchSearchResult: ElementFinder = element(by.css('p.comment-search__item'));
  commentsToggle: ElementFinder = element(by.css('input#comments-btn-toggle'));
  commentsTab: ElementFinder = element(by.css('.govuk-tabs__tab'));
  commentsPanel: ElementFinder = element(by.css('.dropdown-menu #mvCommentsBtn'));

  async clickCommentsToggleIcon() {
    await this.commentsToggleButton.click();
  }

  async clickCommentsToggle() {
    await this.commentsToggle.click();
  }

  async clickOnCommentsTab() {
    await this.commentsTabButton.click();
  }

  async clickOnFilterTab() {
    const result = await this.getFilterTabButtonText();
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

  async enterTextInSearchBox(text: string) {
    await this.searchInputField.sendKeys(text);
  }

  async clickSearch() {
    await this.searchButton.click();
  }

  async clickOnCollateCommentsButton() {
//     await this.collateCommentsButton.click();
    await genericMethods.clickAction('commentSummary');
  }

  async hideCommentsToggle() {
    await this.commentsToggleButton.click();
  }

  async assertToggleButtonText() {
    const result = await this.getToggleButtonText();
    expect(result).to.equal('Hide comments');
  }

  async assertSearchResultText(searchResultStringOnPanel: String) {
    const result = await this.searchResult.getText();
    expect(result.trim()).to.equal(searchResultStringOnPanel.trim());
  }

  async assertNoMatchSearchResultText(searchResultStringOnPanel: String) {
    const result = await this.noMatchSearchResult.getText();
    expect(result.trim()).to.equal(searchResultStringOnPanel.trim());
  }

  async assertNoCommentRowsPresent() {
    const result = await this.commentsContainerHeader.getText();
//     const result = await genericMethods.clickAction('comment-container');
    expect(result).to.equal('No comments available');
    const courtBundleName = await this.courtBundleName.getText();
    expect(courtBundleName).to.equal('Bury Metropolitan Council:  TEST COURT BUNDLE');
  }

//   Unused to see if the scenario passes without it
//   async assertCommentSummaryPresent() {
//     const result = await this.commentsContainerHeader.getText();
//     const result = await genericMethods.clickAction('comment-container');
//     expect(result).to.equal('Bury Metropolitan Council: TEST COURT BUNDLE');
//   }

  async closeOverlayPanel() {
    await this.overlayCloseButton.click();
  }

  async getFilterTabButtonText() {
    return (await this.filterTabButton.getText());
  }

  async getToggleButtonText() {
    return (await this.commentsToggleButton.getText());
  }

  async clickCommentsPanel() {
    await genericMethods.clickAction('mvCommentsBtn');
  }

  async getCommentsTabText() {
    return (await this.commentsTab.getText());
  }

  async getCommentsPanelText() {
    return (await this.commentsPanel.getText());
  }
}
