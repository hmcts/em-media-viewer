import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Directive({
  selector: '[grabNDrag]'
})
export class GrabNDragDirective {

  originalPosition: { left: number; top: number };
  private pointerDown = false;

  @Input() dragX = false;
  @Input() dragY = false;

  constructor(private el: ElementRef) {
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(event: PointerEvent) {
    if (this.dragX || this.dragY) {
      event.preventDefault();
      this.pointerDown = true;
      this.originalPosition = {
        left: event.clientX + this.el.nativeElement.scrollLeft,
        top: event.clientY + this.el.nativeElement.scrollTop,
      };
    }
  }

  @HostListener('window:pointermove', ['$event']) onPointerMove(event: PointerEvent) {
    if (this.pointerDown && (this.dragX || this.dragY)) {
      event.preventDefault();
      const scrollDiff = {
        left: this.originalPosition.left - (event.clientX + this.el.nativeElement.scrollLeft),
        top: this.originalPosition.top - (event.clientY + this.el.nativeElement.scrollTop)
      };
      if (this.dragX) {
        this.el.nativeElement.scrollLeft += scrollDiff.left;
      }
      if (this.dragY) {
        this.el.nativeElement.scrollTop += scrollDiff.top;
      }
    }
  }

  @HostListener('window:pointerup') onWindowPointerUp() {
    this.pointerDown = false;
  }
}
