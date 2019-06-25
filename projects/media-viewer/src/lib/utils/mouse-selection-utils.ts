// Custom Type Definition
export interface Coordinates {
  x: number;
  y: number;
}

export class MouseSelectionUtils {

  // Return the absolute positioning of the top, left x & y coordinates relative to the localElement
  static getTargetElementAbsoluteMouseCoordinates(event: MouseEvent): Coordinates {
    const responseObject = {
      x: event.x,
      y: event.y
    };

    // Get the VIEWPORT-relative coordinates of the click.
    const viewportX: number = event.clientX;
    const viewportY: number = event.clientY;
    //
    // Obtain the HTMLElement from the event
    const localElement: Element = (<Element>event.target) || (<Element>event.srcElement);
    if (!localElement) {
      return responseObject;
    }
    // Now that we have the VIEWPORT coordinates of the CLICK, we need to get the
    // VIEWPORT position of the target element.
    const boxRectangle = localElement.getBoundingClientRect();

    // Now that we have the targets VIEWPORT coordinates and the click's VIEWPORT
    // coordinates, we can take the difference between the two in order to
    // translate the VIEWPORT coordinates into target-LOCAL coordinates.
    const localX: number = (viewportX - boxRectangle.left);
    const localY: number = (viewportY - boxRectangle.top);

    if (localX && localY) {
      responseObject.x = localX;
      responseObject.y = localY;
    }
    return responseObject;
  }
}
