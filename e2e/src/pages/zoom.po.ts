import { by, element } from 'protractor';
import { AppPage } from './app.po';

export class ZoomPage extends AppPage{

  async zoomIn() {
    await this.clickElement(by.id('zoomIn'));
  }

  async zoomOut() {
    await this.clickElement(by.id('zoomOut'));
  }

  async currentZoom() {
    const el = await element(by.id('customScaleOption'));
    return el.getText();
  }

  async setZoomTo(zoomOption) {
    await this.clickElement(by.id('scaleSelect'));
    await this.clickElement(by.cssContainingText('select[id="scaleSelect"] option', zoomOption));
  }
}
