import {browser, by, element, ElementFinder} from 'protractor';
import {AppPage} from './app.po';

export class NavigatePage extends AppPage {
  public pageNumber: ElementFinder;
  public next: ElementFinder;
  public previous: ElementFinder;

  constructor() {
    super();
    this.next = element(by.id('next'));
    this.previous = element(by.id('previous'));
    this.pageNumber = element(by.id('pageNumber'));
  }

  async number() {
    await this.waitForElement(by.id('pageNumber'));
    return element(by.id('pageNumber')).getAttribute('value');
  }

  async goToNextPage() {
    await this.next.click().then(async function () {
      await browser.driver.sleep(2000);
    });
  }

  async goToPreviousPage() {
    await this.previous.click().then(async function () {
      await browser.driver.sleep(2000);
    });
  }
}
