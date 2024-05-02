import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Position } from './model/position.model';

@Directive({
  selector: '[draggable]'
})
export class DraggableElementDirective {

  originalPosition: Position;
  private pointerDown: boolean = false;

  @Input() rotate = 0;
  @Output() coordinates = new EventEmitter<Position>();
  @Output() stopped = new EventEmitter();

  constructor(private el: ElementRef) {
    el.nativeElement.style.position = 'absolute';
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(event: PointerEvent) {
    event.preventDefault();
    this.pointerDown = true;
    this.setOriginalPosition(event);
  }

  @HostListener('pointerup') onPointerUp() {
    this.stopped.emit();
  }

  @HostListener('window:pointermove', ['$event']) onPointerMove(event: PointerEvent) {
    if (this.pointerDown) {
      const element = this.el.nativeElement;
      const newPosition = this.setNewPosition(event);
      this.setOriginalPosition(event);
      element.style.left = (element.offsetLeft + newPosition.x) + 'px';
      element.style.top = (element.offsetTop + newPosition.y) + 'px';
      this.coordinates.emit({ x: newPosition.x, y: newPosition.y });
    }
  }

  @HostListener('window:pointerup') onWindowPointerUp() {
    this.pointerDown = false;
  }

  @HostListener('panstart', ['$event']) onPanStart(event: any) {
    this.onPointerDown(event.srcEvent);
  }

  @HostListener('panend') onPanEnd() {
      this.onPointerUp();
  }

  @HostListener('window:panmove', ['$event']) onPanMove(event: any) {
    this.onPointerMove(event.srcEvent);
  }

  @HostListener('window:panend') onWindowPanEnd() {
    this.onWindowPointerUp();
  }

  private setOriginalPosition(event: PointerEvent): void {
    switch (this.rotate) {
      case 90:
        this.originalPosition = {
          x: event.clientY,
          y: screen.width - event.clientX
        };
        break;
      case 180:
        this.originalPosition = {
          x: screen.width - event.clientX,
          y: screen.height - event.clientY
        };
        break;
      case 270:
        this.originalPosition = {
          x: screen.height - event.clientY,
          y: event.clientX
        };
        break;
      default:
        this.originalPosition = {
          x: event.clientX,
          y: event.clientY
        };
    }
  }

  private setNewPosition(event: PointerEvent): Position {
    let newPosition: Position = {
      x: 0,
      y: 0
    };
    switch (this.rotate) {
      case 90:
        newPosition = {
          x: event.clientY - this.originalPosition.x,
          y: (screen.width - event.clientX) - this.originalPosition.y
        };
        break;
      case 180:
        newPosition = {
          x: (screen.width - event.clientX) - this.originalPosition.x,
          y: (screen.height - event.clientY) - this.originalPosition.y
        };
        break;
      case 270:
        newPosition = {
          x: (screen.height - event.clientY) - this.originalPosition.x,
          y: event.clientX - this.originalPosition.y
        };
        break;
      default:
        newPosition = {
          x: event.clientX - this.originalPosition.x,
          y: event.clientY - this.originalPosition.y
        };
    }
    return newPosition;
  }
}
