import { TestBed } from '@angular/core/testing';
import {MouseSelectionUtils} from './mouse-selection-utils';

describe('Mouse Selection Utilities', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MouseSelectionUtils]
    });
  });
  it('should return an X and Y Object Model ', () => {
    // Generate a Fake Mouse Event for Testing purposes
    const mouseEvent = new MouseEvent('click', {
      clientX: 1,
      clientY: 1
    });
    // Expect the default response to be {x:0, y: 0}
    expect(MouseSelectionUtils.getTargetElementAbsoluteMouseCoordinates(mouseEvent)).toEqual({x: 1, y: 1});
    });
  it('should return {x:1, y:1} when clicking in a localElement positioned at {x:10, y: 10} with mouse coord of {x:11, y:11}', () => {
    const mouseEvent = new MouseEvent('click', {
      clientX: 11,
      clientY: 11
    });

    // Replace the targetElement with our very own along with custom boxRectangle coordinates
    spyOnProperty(mouseEvent, 'target').and.callFake(() => {
      const element: Element = (<Element> document.createElement('div'));
      spyOn(element, 'getBoundingClientRect').and.callFake(() => {
        return new DOMRect(10, 10, 10, 100);
      });
      return element;
    });
    expect(MouseSelectionUtils.getTargetElementAbsoluteMouseCoordinates(mouseEvent)).toEqual({x: 1, y: 1});
  });
  it('should return {x:1, y:11} when clicking in a localElement pos at {x:10, y: 10} +' +
    ' with  mouse coord of {x:11, y:11} and a scroll of of 10', () => {
    const mouseEvent = new MouseEvent('click', {
      clientX: 11,
      clientY: 11
    });

    // Replace the targetElement with our very own along with custom boxRectangle coordinates
    spyOnProperty(mouseEvent, 'target').and.callFake(() => {
      const element: Element = (<Element> document.createElement('div'));
      // Apply the same changes a Y Scroll would make to the bounded rectangle
      spyOn(element, 'getBoundingClientRect').and.callFake(() => {
        return new DOMRect(10, 0, 10, 100);
      });
      return element;
    });
    expect(MouseSelectionUtils.getTargetElementAbsoluteMouseCoordinates(mouseEvent)).toEqual({x: 1, y: 11});
  });
});
