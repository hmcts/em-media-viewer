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
  selector: '[mvKeyboardBoxDraw]',
  standalone: false
})
export class KeyboardBoxDrawDirective implements OnDestroy {

  @Input() set enabled(value: boolean) {
    const wasEnabled = this._enabled;
    this._enabled = value;

    if (value && !wasEnabled && KeyboardBoxDrawDirective.lastInteractionWasKeyboard && !this.showCursor) {
      this.initializeCursorForKeyboard();
    }
  }
  get enabled(): boolean {
    return this._enabled;
  }
  private _enabled = false;

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
  private static lastInteractionWasKeyboard = false;

  constructor(private elementRef: ElementRef<HTMLElement>) {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', KeyboardBoxDrawDirective.onGlobalKeyDown, { capture: true });
      window.addEventListener('mousedown', KeyboardBoxDrawDirective.onGlobalMouseDown, { capture: true });
    }
  }

  private static onGlobalKeyDown(): void {
    KeyboardBoxDrawDirective.lastInteractionWasKeyboard = true;
  }

  private static onGlobalMouseDown(): void {
    KeyboardBoxDrawDirective.lastInteractionWasKeyboard = false;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initializeCursorForKeyboard(): void {
    if (this.enabled && !this.showCursor && !this.isDrawing) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.cursorX = rect.width / 2;
        this.cursorY = rect.height / 2;
        this.showCursor = true;
        this.emitCursorPosition();
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();

      if (!this.isDrawing) {
        this.startDrawing();
      } else {
        this.confirmDrawing();
      }
      return;
    }

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

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      if (this.isDrawing) {
        this.resizeBox(event);
      } else {
        this.moveCursor(event);
      }
    }
  }

  @HostListener('blur')
  onBlur(): void {
    if (this.showCursor && !this.isDrawing) {
      this.hideCursor();
    }
  }

  private moveCursor(event: KeyboardEvent): void {
    const increment = event.shiftKey ? this.incrementLarge : this.incrementMedium;

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
      // default to center
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
        const maxWidth = rect.width - this.drawStartX;
        this.currentWidth = Math.min(maxWidth, this.currentWidth + increment);
        break;
      case 'ArrowLeft':
        this.currentWidth = Math.max(this.minBoxSize, this.currentWidth - increment);
        break;
      case 'ArrowDown':
        const maxHeight = rect.height - this.drawStartY;
        this.currentHeight = Math.min(maxHeight, this.currentHeight + increment);
        break;
      case 'ArrowUp':
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