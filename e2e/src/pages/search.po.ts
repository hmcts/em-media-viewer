import {by, element, ElementFinder} from 'protractor';
import {AppPage} from './app.po';
import {GenericMethods} from '../utils/genericMethods';

const genericMethods = new GenericMethods();

export class SearchPage extends AppPage {

  searchCount: ElementFinder = element(by.xpath('//span[@id=\'findResultsCount\']'));
  searchIcon: ElementFinder = element(by.xpath('//button[@id=\'mvSearchBtn\']'));
  searchField: ElementFinder = element(by.css('#findbarInputContainer > input'));
  findIndex: ElementFinder = element(by.xpath('//button[@id=\'findNext\']'));

  async toggleSearchBar() {
    return this.clickElement(by.id('mvSearchBtn'));
  }

  async searchFor(searchTerm: string) {
    const searchBar = element(by.css('input[title="Find"]'));
    searchBar.clear();
    searchBar.sendKeys(searchTerm);
    return await this.waitForSearchResults();
  }

  async goToNextResult() {
    await this.clickElement(by.id('findNext'));
    return this.waitForSearchResults();
  }

  async goToPreviousResult() {
    await this.clickElement(by.id('findPrevious'));
    return await this.waitForSearchResults();
  }

  async selectMatchCase() {
    await this.clickElement(by.id('findMatchCase'));
    return await this.waitForSearchResults();
  }

  async selectedSearchResult() {
    await this.waitForElement(by.className('highlight selected'));
    return element(by.className('highlight selected')).getWebElement().getLocation();
  }

  async selectedSearchText() {
    const el = await element(by.css('.highlight.selected'));
    return el.getText();
  }

  async firstSearchResult() {
    await this.waitForElementsArray(by.css('.highlight'));
    return element.all(by.css('.highlight')).get(0).getLocation();
  }

  async secondSearchResult() {
    await this.waitForElementsArray(by.css('.highlight'));
    return element.all(by.css('.highlight')).get(1).getWebElement().getLocation();
  }

  async waitForSearchResults() {
    await this.waitForElementsArray(by.css('.highlight'));
    return element.all(by.css('.highlight')).count();
  }

  async searchResultsCounter() {
    await this.waitForElement(by.id('findResultsCount'));
    return element(by.id('findResultsCount')).getText();
  }

  async clickSearchIcon() {
    await this.searchIcon.click();
  }

  async getSearchCount(): Promise<string> {
    return await this.searchCount.getText();
  }

  async searchText(text: string) {
    await this.searchField.sendKeys(text);
    await genericMethods.sleep(10000);
  }

  async clickFindIndex() {
    await this.findIndex.click();
  }
}
