import {by, element, ElementFinder} from 'protractor';
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
}
