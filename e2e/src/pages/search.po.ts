import { by, element } from 'protractor';
import { AppPage } from './app.po';

export class SearchPage extends AppPage {

  toggleSearchBar() {
    return element(by.id('viewFind')).click();
  }

  async searchFor(searchTerm: string) {
    const searchBar = element(by.css('input[title="Find"]'));
    searchBar.clear();
    searchBar.sendKeys(searchTerm);
    return await this.waitForSearchResults();
  }

  async goToNextResult() {
    element(by.id('findNext')).click();
    return await this.waitForSearchResults();
  }

  async goToPreviousResult() {
    element(by.id('findPrevious')).click();
    return await this.waitForSearchResults();
  }

  async selectMatchCase() {
    element(by.id('findMatchCase')).click();
    return await this.waitForSearchResults();
  }

  async selectedSearchResult() {
    await this.waitForElement(by.className('highlight selected'));
    return element(by.className('highlight selected')).getWebElement().getLocation();
  }

  async selectedSearchText() {
    await this.waitForElement(by.className('highlight selected'));
    return element(by.className('highlight selected')).getText();
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
}
