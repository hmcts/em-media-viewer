/**
 * Helper Class
 * Used for dynamic templates manipulation
 * */

export class HtmlTemplatesHelper {

  static setDescribedBy(errorMessage, config) {
    if (!errorMessage) {
      return config.hint ? `${config.id}-hint` : null;
    } else if (errorMessage && errorMessage.isInvalid) {
      return  config.hint ? `${config.id}-hint ${config.id}-error` : `${config.id}-error`;
    } else {
      return config.hint ? `${config.id}-hint` : null;
    }
  }

  static getAdjustedBoundingRect(element: HTMLElement, log: boolean = true): DOMRect {
    const viewportX = window.visualViewport.offsetLeft
    const viewportY = window.visualViewport.offsetTop;
    const viewportScale = window.visualViewport.scale;
    const viewportPageX  = window.visualViewport.pageLeft;
    const viewportPageY  = window.visualViewport.pageTop;
    if (log && viewportX || viewportY || (viewportScale != 1)  || viewportPageX || viewportPageY) {
      console.log(`Element: ${element.id} Viewport X: ${viewportX}, Y: ${viewportY}, Scale: ${viewportScale}, PageX: ${viewportPageX}, PageY: ${viewportPageY}`);
    }
    return element.getBoundingClientRect();
  }
}
