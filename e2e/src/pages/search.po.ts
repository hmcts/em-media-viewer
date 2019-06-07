import { by, element } from 'protractor';
import { AppPage } from './app.po';

export class SearchPage extends AppPage {

  toggleSearchBar() {
    return element(by.id('viewFind')).click();
  }

  searchFor(searchTerm: string) {
    const searchBar = element(by.css('input[title="Find"]'));
    searchBar.clear();
    searchBar.sendKeys(searchTerm);
  }

  goToNextResult() {
    return element(by.id('findNext')).click();
  }

  goToPreviousResult() {
    return element(by.id('findPrevious')).click();
  }

  async selectedSearchResult() {
    await this.waitForElement(by.className('highlight selected'));
    return await element(by.className('highlight selected')).getWebElement().getLocation();
  }

  async selectedSearchText() {
    await this.waitForElement(by.className('highlight selected'));
    return await element(by.className('highlight selected')).getText();
  }

  async firstSearchResult() {
    await this.waitForElementsArray(by.css('.highlight'));
    return element.all(by.css('.highlight')).get(0).getLocation();
  }

  async secondSearchResult() {
    await this.waitForElementsArray(by.css('.highlight'));
    return element.all(by.css('.highlight')).get(1).getWebElement().getLocation();
  }

  async numberOfSearchResults() {
    await this.waitForElementsArray(by.css('.highlight'));
    return (await element.all(by.css('.highlight')).getWebElements()).length;
  }

  toggleHighlightAll() {
    return element(by.id('findHighlightAll')).click();
  }

  selectMatchCase() {
    return element(by.id('findMatchCase')).click();
  }

  selectWholeWords() {
    return element(by.id('findEntireWord')).click();
  }

  async searchResultsCounter() {
    await this.waitForElement(by.id('findResultsCount'));
    return await element(by.id('findResultsCount')).getText();
  }
}
