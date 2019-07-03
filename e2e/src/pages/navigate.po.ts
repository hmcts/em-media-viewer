import {by, element, ElementFinder} from 'protractor';
import { AppPage } from './app.po';

export class NavigatePage extends AppPage {
   public pageNumber: ElementFinder;
   public next: ElementFinder;
   public previous: ElementFinder;

  constructor () {
    super();
    console.log('Navigate Page Constructor');

    this.next = element(by.id('next'));
    this.previous = element(by.id('previous'));
    this.pageNumber = element(by.id('pageNumber'));

  }


  async number() {
    // await this.waitForElement(by.id('pageNumber'));
    // return element(by.id('pageNumber')).getAttribute('value');
  }

  async goToNextPage() {
    console.log('Navigate Page Method');
    // await this.waitForElement(by.id('next'));
    // await this.clickElement(by.id('next'));
  }

  async goToPreviousPage() {
    await this.waitForElement(by.id('previous'));
    await this.clickElement(by.id('previous'));
  }
}
