import {browser, by, element, ElementFinder, Key, protractor} from 'protractor';
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
    await (await this.next).click();
  }

  async goToPreviousPage() {
    await (await this.previous).click();
  }

  async setPageNumber(num: number) {
    await this.pageNumber.clear();
    await this.pageNumber.sendKeys(num);
    await browser.sleep(5000);
    await this.pageNumber.sendKeys(Key.ENTER);
  }
}
