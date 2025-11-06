import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';

export interface KeyboardTextHighlightEvent {
  page: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface CursorPosition {
  x: number;
  y: number;
  visible: boolean;
}

@Directive({
  selector: '[mvKeyboardTextHighlight]'
})
export class KeyboardTextHighlightDirective implements OnDestroy {

  @Input() set enabled(value: boolean) {
    const wasEnabled = this._enabled;
    this._enabled = value;
  }
  get enabled(): boolean {
    return this._enabled;
  }
  private _enabled = false;

  @Input() incrementSmall = 5;
  @Input() incrementMedium = 10;
  @Input() incrementLarge = 20;

  @Output() selectionStarted = new EventEmitter<void>();
  @Output() selectionUpdated = new EventEmitter<KeyboardTextHighlightEvent>();
  @Output() selectionConfirmed = new EventEmitter<void>();
  @Output() selectionCancelled = new EventEmitter<void>();
  @Output() cursorPositionChanged = new EventEmitter<CursorPosition>();
  @Output() selectionCursorPositionChanged = new EventEmitter<CursorPosition>();

  private isSelecting = false;
  private cursorX: number;
  private cursorY: number;
  private showCursor = false;
  private selectionStartX: number;
  private selectionStartY: number;
  private selectionEndX: number;
  private selectionEndY: number;
  private currentPage: number;
  private lastValidEndNode: Node | null = null;
  private lastValidEndOffset: number = 0;
  private static lastInteractionWasKeyboard = false;

  constructor(private elementRef: ElementRef<HTMLElement>) {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', KeyboardTextHighlightDirective.onGlobalKeyDown, { capture: true });
      window.addEventListener('mousedown', KeyboardTextHighlightDirective.onGlobalMouseDown, { capture: true });
    }
  }

  private static onGlobalKeyDown(): void {
    KeyboardTextHighlightDirective.lastInteractionWasKeyboard = true;
  }

  private static onGlobalMouseDown(): void {
    KeyboardTextHighlightDirective.lastInteractionWasKeyboard = false;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();

      if (!this.isSelecting) {
        this.startTextSelection();
      } else {
        this.confirmTextSelection();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      if (this.isSelecting) {
        this.cancelTextSelection();
      } else if (this.showCursor) {
        this.hideCursor();
      }
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      if (this.isSelecting) {
        this.expandTextSelection(event);
      } else {
        this.moveCursor(event);
      }
    }
  }

  @HostListener('blur')
  onBlur(): void {
    if (this.showCursor && !this.isSelecting) {
      this.hideCursor();
    }
  }

  private moveCursor(event: KeyboardEvent): void {
    const increment = event.shiftKey ? this.incrementLarge : this.incrementMedium;

    if (!this.showCursor) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      this.cursorX = viewportWidth / 2;
      this.cursorY = viewportHeight / 2;
      this.showCursor = true;

      this.emitCursorPosition();
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    switch (event.key) {
      case 'ArrowUp':
        this.cursorY = Math.max(0, this.cursorY - increment);
        break;
      case 'ArrowDown':
        this.cursorY = Math.min(viewportHeight, this.cursorY + increment);
        break;
      case 'ArrowLeft':
        this.cursorX = Math.max(0, this.cursorX - increment);
        break;
      case 'ArrowRight':
        this.cursorX = Math.min(viewportWidth, this.cursorX + increment);
        break;
    }

    this.emitCursorPosition();
  }

  private startTextSelection(): void {
    if (this.showCursor) {
      this.selectionStartX = this.cursorX;
      this.selectionStartY = this.cursorY;
      this.selectionEndX = this.cursorX;
      this.selectionEndY = this.cursorY;
      this.showCursor = false;
      this.emitCursorPosition();
    } else {
      // default to center
      this.selectionStartX = window.innerWidth / 2;
      this.selectionStartY = window.innerHeight / 2;
      this.selectionEndX = this.selectionStartX;
      this.selectionEndY = this.selectionStartY;
    }

    this.isSelecting = true;
    this.currentPage = this.getCurrentPageNumber();
    this.lastValidEndNode = null;
    this.lastValidEndOffset = 0;

    this.selectionCursorPositionChanged.emit({
      x: this.selectionEndX,
      y: this.selectionEndY,
      visible: true
    });

    this.createTextSelectionAtPoint(this.selectionStartX, this.selectionStartY);

    this.selectionStarted.emit();
  }

  private expandTextSelection(event: KeyboardEvent): void {
    const increment = event.shiftKey ? this.incrementLarge : this.incrementSmall;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    switch (event.key) {
      case 'ArrowRight':
        this.selectionEndX = Math.min(viewportWidth, this.selectionEndX + increment);
        break;
      case 'ArrowLeft':
        this.selectionEndX = Math.max(0, this.selectionEndX - increment);
        break;
      case 'ArrowDown':
        this.selectionEndY = Math.min(viewportHeight, this.selectionEndY + increment);
        break;
      case 'ArrowUp':
        this.selectionEndY = Math.max(0, this.selectionEndY - increment);
        break;
    }

    this.selectionCursorPositionChanged.emit({
      x: this.selectionEndX,
      y: this.selectionEndY,
      visible: true
    });

    this.updateTextSelection();

    this.emitSelectionUpdated();
  }

  private createTextSelectionAtPoint(viewportX: number, viewportY: number): void {
    const selection = window.getSelection();

    // get precise caret position at the coordinates
    // caretPositionFromPoint is standard but not supported in all browsers
    // caretRangeFromPoint is older and supported in more browsers
    let range: Range | null = null;

    if ((document as any).caretPositionFromPoint) {
      const caretPosition = (document as any).caretPositionFromPoint(viewportX, viewportY);
      if (caretPosition) {
        range = document.createRange();
        range.setStart(caretPosition.offsetNode, caretPosition.offset);
        range.collapse(true);
      }
    } else if ((document as any).caretRangeFromPoint) {
      range = (document as any).caretRangeFromPoint(viewportX, viewportY);
    }

    if (range) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  private updateTextSelection(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const startOffset = range.startOffset;

    let endNode: Node | null = null;
    let endOffset = 0;

    if ((document as any).caretPositionFromPoint) {
      const caretPosition = (document as any).caretPositionFromPoint(this.selectionEndX, this.selectionEndY);
      if (caretPosition) {
        endNode = caretPosition.offsetNode;
        endOffset = caretPosition.offset;
      }
    } else if ((document as any).caretRangeFromPoint) {
      const caretRange = (document as any).caretRangeFromPoint(this.selectionEndX, this.selectionEndY);
      if (caretRange) {
        endNode = caretRange.startContainer;
        endOffset = caretRange.startOffset;
      }
    }

    if (endNode) {
      const range = document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);

      const isBackward = range.collapsed && (startNode !== endNode || endOffset < startOffset);
      const comparison = startNode.compareDocumentPosition(endNode);
      const endBeforeStart = (comparison & Node.DOCUMENT_POSITION_PRECEDING) !== 0;

      if (isBackward || endBeforeStart) {
        if (this.lastValidEndNode) {
          endNode = this.lastValidEndNode;
          endOffset = this.lastValidEndOffset;
        } else {
          endNode = startNode;
          endOffset = startOffset;
        }
      } else {
        this.lastValidEndNode = endNode;
        this.lastValidEndOffset = endOffset;
      }

      selection.setBaseAndExtent(
        startNode,
        startOffset,
        endNode,
        endOffset
      );
    }
  }

  private confirmTextSelection(): void {
    this.selectionConfirmed.emit();
    this.selectionCursorPositionChanged.emit({
      x: this.selectionEndX,
      y: this.selectionEndY,
      visible: false
    });
    this.cleanup();
  }

  private cancelTextSelection(): void {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }

    this.selectionCancelled.emit();
    this.selectionCursorPositionChanged.emit({
      x: this.selectionEndX,
      y: this.selectionEndY,
      visible: false
    });
    this.cleanup();
  }

  private hideCursor(): void {
    this.showCursor = false;
    this.emitCursorPosition();
  }

  private cleanup(): void {
    this.isSelecting = false;
    this.showCursor = false;
    this.cursorX = undefined;
    this.cursorY = undefined;
    this.selectionStartX = undefined;
    this.selectionStartY = undefined;
    this.selectionEndX = undefined;
    this.selectionEndY = undefined;
    this.currentPage = undefined;
    this.lastValidEndNode = null;
    this.lastValidEndOffset = 0;
  }

  private getCurrentPageNumber(): number {
    let currentElement = this.elementRef.nativeElement;
    while (currentElement && currentElement.offsetParent) {
      currentElement = currentElement.offsetParent as HTMLElement;
      if (currentElement.getAttribute) {
        const page = parseInt(currentElement.getAttribute('data-page-number'), 10);
        if (page) {
          return page;
        }
      }
    }
    return 1;
  }

  private emitCursorPosition(): void {
    const position = {
      x: this.cursorX,
      y: this.cursorY,
      visible: this.showCursor
    };
    this.cursorPositionChanged.emit(position);
  }

  private emitSelectionUpdated(): void {
    this.selectionUpdated.emit({
      page: this.currentPage,
      startX: this.selectionStartX,
      startY: this.selectionStartY,
      endX: this.selectionEndX,
      endY: this.selectionEndY
    });
  }

  public reset(): void {
    this.cleanup();
    this.emitCursorPosition();
  }
}