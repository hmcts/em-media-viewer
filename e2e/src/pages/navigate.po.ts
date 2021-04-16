import { browser, by, element, ElementFinder } from 'protractor';
import { AppPage } from './app.po';

export class NavigatePage extends AppPage {
  public pageNumber: ElementFinder;
  public next: ElementFinder;
  public previous: ElementFinder;

  constructor() {
    super();
    this.next = element(by.id('mvDownBtn'));
    this.previous = element(by.id('mvUpBtn'));
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
    await browser.executeScript((pageNum: string) => {
      const input: HTMLInputElement = <HTMLInputElement> document.getElementById('pageNumber');
      input.value = pageNum;
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', false, true);
      input.dispatchEvent(evt);
    }, num.toString());
    await browser.sleep(3000);

  }
}
