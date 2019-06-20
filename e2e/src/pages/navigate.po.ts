import { by, element } from 'protractor';
import { AppPage } from './app.po';

export class NavigatePage extends AppPage {

  async goToNextPage() {
    await this.waitForElement(by.id('next'));
     element(by.id('next')).click();
  }

  async goToPreviousPage() {
    await this.waitForElement(by.id('previous'));
    return element(by.id('previous')).click();
  }

  async number() {
    await this.waitForElement(by.id('pageNumber'));
    return element(by.id('pageNumber')).getAttribute('value');
  }
}
