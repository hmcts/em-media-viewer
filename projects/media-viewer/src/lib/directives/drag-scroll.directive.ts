import { Directive, ElementRef, HostListener } from '@angular/core';
import { Position } from './model/position.model';
import { Scroll } from './model/scroll.model';

@Directive({
  selector: '[dragScroll]'
})
export class DragScrollDirective {

  originalScroll: Scroll;
  private pointerDown: boolean = false;

  constructor(private el: ElementRef) {
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(event: PointerEvent) {
    event.preventDefault();
    this.pointerDown = true;
    this.originalScroll = {
      left: event.clientX + this.el.nativeElement.scrollLeft,
      top: event.clientY + this.el.nativeElement.scrollTop,
    };
  }

  @HostListener('window:pointermove', ['$event']) onPointerMove(event: PointerEvent) {
    if (this.pointerDown) {
      event.preventDefault();
      const scrollDiff = {
        left: this.originalScroll.left - (event.clientX + this.el.nativeElement.scrollLeft),
        top: this.originalScroll.top - (event.clientY + this.el.nativeElement.scrollTop)
      };
      this.el.nativeElement.scrollLeft += scrollDiff.left;
      this.el.nativeElement.scrollTop += scrollDiff.top;
    }
  }

  @HostListener('window:pointerup') onWindowPointerUp() {
    this.pointerDown = false;
  }
}
