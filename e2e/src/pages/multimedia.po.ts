import {AppPage} from './app.po';
import {by} from 'protractor';

export class MultimediaPage extends AppPage {

  async clickMultimedia() {
    await this.clickElement(by.id('multimedia-button'));
  }

  async clickPlayButton() {
    await this.clickElement(by.css('#mainContainer > div > mv-multimedia-player'));
  }

  async clickPause() {
    await this.clickElement(by.css('#mainContainer > div > mv-multimedia-player'));
  }
}
