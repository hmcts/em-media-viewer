import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

export class CommentPage extends AppPage {

  async openModal() {
    const checked = await element(by.css('input[id="toggleCommentSummary"]')).getAttribute('checked');
    if (!checked) {
        (await element(by.css('label[for="toggleCommentSummary"]'))).click();
    }
    browser.sleep(5000);
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
    await element(by.id('modal-close-button')).click();
  }

  async clickOutsideModal() {
    browser.sleep(10000);
    (await element(by.id('modal-background'))).click();
    browser.sleep(10000);
  }


}
