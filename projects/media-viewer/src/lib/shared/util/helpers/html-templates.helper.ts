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

  static getAdjustedBoundingRect(element: HTMLElement): DOMRect {
    const viewportX = window.visualViewport.offsetLeft
    const viewportY = window.visualViewport.offsetTop;
    const viewportScale = window.visualViewport.scale;
    const viewportPageX  = window.visualViewport.pageLeft;
    const viewportPageY  = window.visualViewport.pageTop;
    if (viewportX || viewportY || viewportScale  || viewportPageX || viewportPageY) {
      console.log(`Viewport X: ${viewportX}, Y: ${viewportY}, Scale: ${viewportScale}, PageX: ${viewportPageX}, PageY: ${viewportPageY}`);
    }
    return element.getBoundingClientRect();
  }
}
