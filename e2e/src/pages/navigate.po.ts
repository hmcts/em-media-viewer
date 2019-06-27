import {by, element, ElementFinder} from 'protractor';
import { AppPage } from './app.po';

export class NavigatePage extends AppPage {

  async goToNextPage() {
    await this.waitForElement(by.id('next'));
    await this.clickElement(by.id('next'));
  }

  async goToPreviousPage() {
    await this.waitForElement(by.id('previous'));
    await this.clickElement(by.id('previous'));
  }

  async number() {
    await this.waitForElement(by.id('pageNumber'));
    console.log(element(by.id('pageNumber')).getAttribute('value'));
    await element(by.id('pageNumber')).getAttribute('value');
  }
}
