import { by, element } from 'protractor';
import { AppPage } from './app.po';

export class ZoomPage extends AppPage{

  zoomIn() {
    return element(by.id('zoomIn')).click();
  }

  zoomOut() {
    return element(by.id('zoomOut')).click();
  }

  currentZoom() {
    return element(by.id('customScaleOption')).getText();
  }

  async setZoomTo(zoomOption) {
    await element(by.id('scaleSelect')).click();
    return element(by.cssContainingText('select[id="scaleSelect"] option', zoomOption)).click();
  }
}
