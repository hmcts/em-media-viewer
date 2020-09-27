import {browser, by, element, ElementArrayFinder, ElementFinder,} from 'protractor';
import {AppPage} from './app.po';
import {By} from '@angular/platform-browser';
import {expect} from 'chai';


export class CommentsPanelPage extends AppPage {
  //commentsToggleButton  : ElementFinder   =   element(by.xpath("//button[@id=\'sidebarCommentsToggle\' and @title=\'Toggle Comments Sidebar\']"));
  commentsToggleButton  : ElementFinder     =   element(by.id('sidebarCommentsToggle'));
  commentsTabButton     : ElementFinder     =   element(by.xpath(("//div[@class=\'govuk-tabs commentSummaryHeader\']/ul/li[1]/a")));
  filterTabButton       : ElementFinder     =   element(by.xpath(("//div[@class=\'govuk-tabs commentSummaryHeader\']/ul/li[2]/a")));
  searchTabButton       : ElementFinder     =   element(by.xpath(("//div[@class=\'govuk-tabs commentSummaryHeader\']/ul/li[3]/a")));
  collateCommentsButton : ElementFinder     =   element(by.xpath("//button[@id=\'commentSummary\']"));
  commentsNotAvailable  : ElementFinder     =   element(by.xpath("//div[@id=\'comment-container\'/h3"));
  courtBundleName       : ElementFinder     =   element(by.xpath("//div[@id=\'comment-container\'/h2"));
  overlayCloseButton    : ElementFinder     =   element(by.buttonText("Close"));
  searchInputField      : ElementFinder     =   element(by.id('search-comments-input'));
  searchButton          : ElementFinder     =   element(by.xpath('//button[@class=\'govuk-button comment-search\']'));
  searchResult          : ElementFinder     =   element(by.css('#comment-search'));
  commentButton         : ElementFinder     =   element(by.id(''));
  textLayerInPdf        : ElementFinder      =  element(by.xpath(("//div[@class=\'pdfViewer page textLayer\']")));
  // $x("//div[@id='commentButtonId']/button[@id=\'deleteOrCancelBtn\']")
  deleteThisCommentXPath2   : ElementFinder  =   element(by.xpath("//div[@id=\'commentButtonId\']/button[@id=\'deleteOrCancelBtn\']"));
  deleteThisCommentId   : ElementFinder  =   element(by.id("deleteOrCancelBtn"));

  comments              : ElementArrayFinder =  element.all(by.css('mv-anno-comment > div > p'));
  deleteThisCommentCss  : ElementArrayFinder =   element.all(by.css("mv-comment-set > div"));
  tagForComment         : ElementFinder      =  element(by.id('tagIdForComment'));
  tagFieldX             : ElementFinder      =  element(by.css('tag-input > div > div > tag-input-form > form > input'));
  tagFieldXPath         : ElementFinder      =  element(by.xpath("//input[@id='inputTagId']"));

  tagFieldCss           : ElementFinder      =  element(by.cssContainingText("#inputTagId", "Search or add tags")) ;


  inputTagId             : ElementFinder      =  element(by.css('#inputTagId'));
  editOrSaveButton        : ElementFinder     = element(by.id('editOrSaveButton'));
  deleteThisComment     : ElementFinder       = element(by.css('#deleteOrCancelBtn'));
  //
  deleteThisCommentButton: By = by.css('#deleteOrCancelBtn');


  async clickCommentsToggleIcon(){
     await this.commentsToggleButton.click();
  }

  async clickTextLayerPdf(){
    await this.textLayerInPdf.click();
  }

  async clickOnCommentsTab(){
    await this.commentsTabButton.click();
  }

  async clickOnFilterTab(){
    const result  = await this.getFilterTabButtonText();
    expect(result).to.equal("Filter");
    await this.filterTabButton.click();
  }

  async clickOnSearchTab(){
    await this.searchTabButton.click();
 }

  async performSearch(searchText: string){
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

  async hideCommentsToggle(){
    await this.commentsToggleButton.click();
 }

 async assertToggleButtonText()  {
   const result  = await this.getToggleButtonText();
   expect(result).to.equal("Hide comments");
 }

  async assertSearchResultText(searchResultStringOnPanel :String)  {
    let result  = await this.searchResult.getText();
    expect(result).to.equal(searchResultStringOnPanel);
  }

  async assertNoCommentRowsPresent() {
    const result  = await this.commentsNotAvailable.getText();
    expect(result).to.equal("No comments available");
    const courtBundleName  = await this.courtBundleName.getText();
    expect(courtBundleName).to.equal("Bury Metropolitan Council:  TEST COURT BUNDLE");
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
