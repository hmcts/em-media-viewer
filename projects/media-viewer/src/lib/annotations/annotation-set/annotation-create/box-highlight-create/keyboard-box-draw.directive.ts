import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';

export interface KeyboardBoxDrawEvent {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

export interface CursorPosition {
  x: number;
  y: number;
  visible: boolean;
}

@Directive({
  selector: '[mvKeyboardBoxDraw]'
})
export class KeyboardBoxDrawDirective implements OnDestroy {

  @Input() enabled = false;
  @Input() minBoxSize = 10;
  @Input() incrementSmall = 1;
  @Input() incrementMedium = 5;
  @Input() incrementLarge = 10; 

  @Output() drawingStarted = new EventEmitter<KeyboardBoxDrawEvent>();
  @Output() drawingUpdated = new EventEmitter<KeyboardBoxDrawEvent>();
  @Output() drawingConfirmed = new EventEmitter<KeyboardBoxDrawEvent>();
  @Output() drawingCancelled = new EventEmitter<void>();
  @Output() cursorPositionChanged = new EventEmitter<CursorPosition>();

  private isDrawing = false;
  private cursorX: number;
  private cursorY: number;
  private showCursor = false;
  private drawStartX: number;
  private drawStartY: number;
  private currentWidth: number;
  private currentHeight: number;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnDestroy(): void {
    this.cleanup();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    console.log('KeyboardBoxDrawDirective - keydown event: ', event.key);
    console.log('KeyboardBoxDrawDirective - enabled: ', this.enabled);
    if (!this.enabled) {
      return;
    }

    // handle Enter key to start or confirm drawing
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      console.log('Enter key - isDrawing: ', this.isDrawing);

      if (!this.isDrawing) {
        this.startDrawing();
      } else {
        this.confirmDrawing();
      }
      return;
    }

    // handle escape to cancel
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      if (this.isDrawing) {
        this.cancelDrawing();
      } else if (this.showCursor) {
        this.hideCursor();
      }
      return;
    }

    // handle arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      console.log('Arrow key - isDrawing: ', this.isDrawing);

      if (this.isDrawing) {
        this.resizeBox(event);
      } else {
        this.moveCursor(event);
      }
    }
  }

  private moveCursor(event: KeyboardEvent): void {
    const increment = event.shiftKey ? this.incrementLarge : this.incrementMedium;

    // initialize cursor at center if not visible
    if (!this.showCursor) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      this.cursorX = rect.width / 2;
      this.cursorY = rect.height / 2;
      this.showCursor = true;

      this.emitCursorPosition();
      return;
    }

    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    switch (event.key) {
      case 'ArrowUp':
        this.cursorY = Math.max(0, this.cursorY - increment);
        break;
      case 'ArrowDown':
        this.cursorY = Math.min(rect.height, this.cursorY + increment);
        break;
      case 'ArrowLeft':
        this.cursorX = Math.max(0, this.cursorX - increment);
        break;
      case 'ArrowRight':
        this.cursorX = Math.min(rect.width, this.cursorX + increment);
        break;
    }

    this.emitCursorPosition();
  }

  private startDrawing(): void {
    let startX: number;
    let startY: number;

    if (this.showCursor) {
      startX = this.cursorX;
      startY = this.cursorY;
      this.showCursor = false;
      this.emitCursorPosition();
    } else {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      startX = rect.width / 2;
      startY = rect.height / 2;
    }

    this.isDrawing = true;
    this.drawStartX = startX;
    this.drawStartY = startY;
    this.currentWidth = this.minBoxSize;
    this.currentHeight = this.minBoxSize;

    this.emitDrawingStarted();
  }

  private resizeBox(event: KeyboardEvent): void {
    const increment = event.shiftKey ? this.incrementLarge : this.incrementSmall;
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    switch (event.key) {
      case 'ArrowRight':
        // expand width to the right
        const maxWidth = rect.width - this.drawStartX;
        this.currentWidth = Math.min(maxWidth, this.currentWidth + increment);
        break;
      case 'ArrowLeft':
        // shrink width from the right
        this.currentWidth = Math.max(this.minBoxSize, this.currentWidth - increment);
        break;
      case 'ArrowDown':
        // expand height downward
        const maxHeight = rect.height - this.drawStartY;
        this.currentHeight = Math.min(maxHeight, this.currentHeight + increment);
        break;
      case 'ArrowUp':
        // reduce height from the bottom
        this.currentHeight = Math.max(this.minBoxSize, this.currentHeight - increment);
        break;
    }

    this.emitDrawingUpdated();
  }

  private confirmDrawing(): void {
    this.emitDrawingConfirmed();
    this.cleanup();
  }

  private cancelDrawing(): void {
    this.drawingCancelled.emit();
    this.cleanup();
  }

  private hideCursor(): void {
    this.showCursor = false;
    this.emitCursorPosition();
  }

  private cleanup(): void {
    this.isDrawing = false;
    this.showCursor = false;
    this.cursorX = undefined;
    this.cursorY = undefined;
    this.drawStartX = undefined;
    this.drawStartY = undefined;
    this.currentWidth = undefined;
    this.currentHeight = undefined;
  }

  private emitCursorPosition(): void {
    this.cursorPositionChanged.emit({
      x: this.cursorX,
      y: this.cursorY,
      visible: this.showCursor
    });
  }

  private emitDrawingStarted(): void {
    this.drawingStarted.emit({
      startX: this.drawStartX,
      startY: this.drawStartY,
      width: this.currentWidth,
      height: this.currentHeight
    });
  }

  private emitDrawingUpdated(): void {
    this.drawingUpdated.emit({
      startX: this.drawStartX,
      startY: this.drawStartY,
      width: this.currentWidth,
      height: this.currentHeight
    });
  }

  private emitDrawingConfirmed(): void {
    this.drawingConfirmed.emit({
      startX: this.drawStartX,
      startY: this.drawStartY,
      width: this.currentWidth,
      height: this.currentHeight
    });
  }

  public reset(): void {
    this.cleanup();
    this.emitCursorPosition();
  }
}