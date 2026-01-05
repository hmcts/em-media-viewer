import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface BoxMovementBounds {
  containerWidth: number;
  containerHeight: number;
}

@Directive({
  selector: '[mvKeyboardBoxMove]',
  standalone: false
})
export class KeyboardBoxMoveDirective implements OnDestroy {

  @Input() enabled = true;
  @Input() incrementSmall = 1;
  @Input() incrementLarge = 10;
  @Input() movementBounds: BoxMovementBounds;

  @Output() keyboardMovingChange = new EventEmitter<boolean>();
  @Output() boxDelete = new EventEmitter<void>();

  private moveSubject = new Subject<void>();
  private moveSubscription: Subscription;
  private isMoving = false;

  constructor(private elementRef: ElementRef<HTMLElement>) {
    this.moveSubscription = this.moveSubject
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.setMoving(false);
        this.emitStoppedEvent();
      });
  }

  ngOnDestroy(): void {
    if (this.moveSubscription) {
      this.moveSubscription.unsubscribe();
    }
    this.moveSubject.complete();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      event.stopPropagation();
      this.boxDelete.emit();
      return;
    }

    if (!this.enabled) {
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      this.moveBox(event);
    }
  }

  private moveBox(event: KeyboardEvent): void {
    const element = this.elementRef.nativeElement;
    const increment = event.shiftKey ? this.incrementLarge : this.incrementSmall;

    if (!this.isMoving) {
      this.setMoving(true);
    }

    const currentTop = parseFloat(element.style.top) || 0;
    const currentLeft = parseFloat(element.style.left) || 0;
    const currentWidth = element.offsetWidth;
    const currentHeight = element.offsetHeight;

    let newTop = currentTop;
    let newLeft = currentLeft;

    switch (event.key) {
      case 'ArrowUp':
        newTop = currentTop - increment;
        break;
      case 'ArrowDown':
        newTop = currentTop + increment;
        break;
      case 'ArrowLeft':
        newLeft = currentLeft - increment;
        break;
      case 'ArrowRight':
        newLeft = currentLeft + increment;
        break;
    }

    if (this.movementBounds) {
      newTop = Math.max(0, Math.min(newTop, this.movementBounds.containerHeight - currentHeight));
      newLeft = Math.max(0, Math.min(newLeft, this.movementBounds.containerWidth - currentWidth));
    }

    element.style.top = `${newTop}px`;
    element.style.left = `${newLeft}px`;

    this.moveSubject.next();
  }

  private setMoving(moving: boolean): void {
    if (this.isMoving !== moving) {
      this.isMoving = moving;
      this.keyboardMovingChange.emit(moving);
    }
  }

  private emitStoppedEvent(): void {
    const element = this.elementRef.nativeElement;

    const wasFocused = document.activeElement === element;

    const stoppedEvent = new CustomEvent('stopped', {
      detail: element,
      bubbles: true
    });
    element.dispatchEvent(stoppedEvent);

    if (wasFocused) {
      setTimeout(() => {
        element.focus();
      }, 50);
    }
  }
}