import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Position } from './model/position.model';
import { Scroll } from './model/scroll.model';

@Directive({
  selector: '[dragScroll]'
})
export class DragScrollDirective {

  originalScroll: Scroll;
  private pointerDown = false;

  @Input() enableScroll = true;
  @Input() scrollAxis = '';

  constructor(private el: ElementRef) {
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(event: PointerEvent) {
    if (this.enableScroll) {
      event.preventDefault();
      this.pointerDown = true;
      this.originalScroll = {
        left: event.clientX + this.el.nativeElement.scrollLeft,
        top: event.clientY + this.el.nativeElement.scrollTop,
      };
    }
  }

  @HostListener('window:pointermove', ['$event']) onPointerMove(event: PointerEvent) {
    if (this.pointerDown && this.enableScroll) {
      event.preventDefault();
      const scrollDiff = {
        left: this.originalScroll.left - (event.clientX + this.el.nativeElement.scrollLeft),
        top: this.originalScroll.top - (event.clientY + this.el.nativeElement.scrollTop)
      };
      if (this.scrollAxis.includes('vertical')) {
        this.el.nativeElement.scrollLeft += scrollDiff.left;
      }
      if (this.scrollAxis.includes('horizontal')) {
        this.el.nativeElement.scrollTop += scrollDiff.top;
      }
    }
  }

  @HostListener('window:pointerup') onWindowPointerUp() {
    this.pointerDown = false;
  }
}
