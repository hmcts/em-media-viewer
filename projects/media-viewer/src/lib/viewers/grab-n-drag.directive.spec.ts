import { ElementRef } from '@angular/core';
import { GrabNDragDirective } from './grab-n-drag.directive';

describe('GrabNDragDirective', () => {
  let directive: GrabNDragDirective;
  const hostElement = document.createElement('div');
  hostElement.scrollLeft = 20;
  hostElement.scrollTop = 30;
  const event = { clientX: 50, clientY: 40, preventDefault: () => {} };

  beforeEach(() => {
    directive = new GrabNDragDirective(new ElementRef<HTMLElement>(hostElement));
    directive.dragX = { scrollLeft: 0 } as Element;
  });

  it('should set original position on pointer down', () => {
    directive.dragEnabled = true;

    directive.onPointerDown(event as any);

    expect(directive.originalPosition).toEqual({ left: 50, top: 40 } as any);
  });

  it('should set host element on pointer move', () => {
    directive.dragEnabled = true;

    directive.onPointerMove(event as any);

    expect(hostElement.scrollLeft).toEqual(0);
    expect(hostElement.scrollTop).toEqual(0);
  });

  it('should set host element on pointer move, when pointer down', () => {
    directive.dragEnabled = true;

    directive.onPointerDown(event as any);
    directive.onPointerMove(event as any);

    expect(hostElement.scrollLeft).toEqual(0);
    expect(hostElement.scrollTop).toEqual(0);
  });

  it('should set host element on pointer move, when dragX', () => {
    directive.dragEnabled = true;

    directive.onPointerDown(event as any);
    directive.onPointerMove(event as any);

    expect(hostElement.scrollLeft).toEqual(0);
    expect(hostElement.scrollTop).toEqual(0);
  });

  it('should set host element on pointer move, when dragY', () => {
    directive.dragEnabled = false;

    directive.onPointerDown(event as any);
    directive.onPointerMove(event as any);

    expect(hostElement.scrollLeft).toEqual(0);
    expect(hostElement.scrollTop).toEqual(0);
  });
});
