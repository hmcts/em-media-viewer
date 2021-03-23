import {by, element} from "protractor";
import {AppPage} from "./app.po";
import {ElementFinder} from "protractor/built/element";

export class ZoomPage extends AppPage {

    async zoomIn() {
        await this.clickElement(by.id("mvPlusBtn"));
    }

    async zoomOut() {
        await this.clickElement(by.id("mvMinusBtn"));
    }

    async currentZoom() {
        const el: ElementFinder = await element(by.id("customScaleOption"));
        return el.getText().then(text => text.trim());
    }

    async setZoomTo(zoomOption: string) {
        await this.clickElement(by.id("scaleSelect"));
        await this.clickElement(by.cssContainingText("select[id='scaleSelect'] option", zoomOption));
    }
}
