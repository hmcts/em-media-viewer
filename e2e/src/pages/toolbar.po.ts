import {AppPage} from './app.po';
import {by} from 'protractor';

export class ToolBar extends AppPage {

  async clickToolBarButton() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

  async dontClickToolBarButton() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

}
