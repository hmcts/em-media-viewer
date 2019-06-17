import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

export class CommentPage extends AppPage {

  async openModal() {
    const el = await element(by.css('input[id="toggleCommentSummary"]'));
    const checked = await el.getAttribute('checked');
    if (!checked) {
      await this.clickElement(by.css('label[for="toggleCommentSummary"]'));
    }
  }

  async getModal() {
    await this.waitForElement(by.id('modal'));
    return (await element(by.id('modal')));
  }

  async getModalText() {
    await this.waitForElement(by.id('modal'));
    const modalText = await (await element(by.id('modal'))).getText();
    return modalText;
  }

  async modalIsOpen() {
    return (await element(by.id('modal'))).isPresent();
  }

  async clickCloseButton() {
    await this.clickElement(by.id('modal-close-button'));
  }

  async clickOutsideModal() {
    browser.sleep(10000);
    await this.clickElement(by.id('modal-background'));
    browser.sleep(10000);
  }


}
