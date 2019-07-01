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
    // await this.waitForElement(by.id('pageNumber'));
    const  page = element(by.xpath('//*[@id="pageNumber"]')).getAttribute('value');
    console.log('Page Number ' + page)
    console.log(element(by.xpath('//*[@id="pageNumber"]')).getAttribute('value'));
    return await element(by.xpath('//*[@id="pageNumber"]')).getAttribute('value');
  }
}
