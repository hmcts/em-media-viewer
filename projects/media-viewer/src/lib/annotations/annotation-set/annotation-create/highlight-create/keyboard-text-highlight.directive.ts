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

    // Don't auto-initialize cursor - let it appear on first arrow key press
    // This prevents the Enter key from the button click triggering startTextSelection
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
      console.log('[KeyboardTextHighlight] Arrow key pressed:', event.key, 'isSelecting:', this.isSelecting, 'showCursor:', this.showCursor);

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
      // we use window dimensions because we're using fixed positioning
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

    console.log('[KeyboardTextHighlight] Selection expanded to viewport coords:', this.selectionEndX, this.selectionEndY);

    this.selectionCursorPositionChanged.emit({
      x: this.selectionEndX,
      y: this.selectionEndY,
      visible: true
    });

    this.updateTextSelection();

    this.emitSelectionUpdated();
  }

  private createTextSelectionAtPoint(viewportX: number, viewportY: number): void {
    console.log('[KeyboardTextHighlight] createTextSelectionAtPoint at viewport coords:', viewportX, viewportY);
    const element = this.elementRef.nativeElement;
    const textLayer = element.querySelector('.textLayer') as HTMLElement;

    if (!textLayer) {
      console.log('[KeyboardTextHighlight] No textLayer found');
      return;
    }

    const elementAtPoint = document.elementFromPoint(viewportX, viewportY);
    console.log('[KeyboardTextHighlight] Element at point:', elementAtPoint, 'is in textLayer:', elementAtPoint && textLayer.contains(elementAtPoint));

    if (elementAtPoint && textLayer.contains(elementAtPoint)) {
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
          console.log('[KeyboardTextHighlight] Using caretPositionFromPoint:', {
            offsetNode: caretPosition.offsetNode,
            offset: caretPosition.offset,
            text: caretPosition.offsetNode.textContent?.substring(0, 50)
          });
        }
      } else if ((document as any).caretRangeFromPoint) {
        range = (document as any).caretRangeFromPoint(viewportX, viewportY);
        if (range) {
          console.log('[KeyboardTextHighlight] Using caretRangeFromPoint:', {
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            text: range.startContainer.textContent?.substring(0, 50)
          });
        }
      }

      if (range) {
        selection.removeAllRanges();
        selection.addRange(range);
        console.log('[KeyboardTextHighlight] Initial selection created at precise position');
      } else {
        console.log('[KeyboardTextHighlight] Could not get caret position from point');
      }
    } else {
      console.log('[KeyboardTextHighlight] Element not found or not in textLayer');
    }
  }

  private updateTextSelection(): void {
    console.log('[KeyboardTextHighlight] updateTextSelection called');
    const element = this.elementRef.nativeElement;
    const textLayer = element.querySelector('.textLayer') as HTMLElement;

    if (!textLayer) {
      console.log('[KeyboardTextHighlight] No textLayer found');
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log('[KeyboardTextHighlight] No selection or no ranges');
      return;
    }

    console.log('[KeyboardTextHighlight] Updating selection end to viewport coords:', this.selectionEndX, this.selectionEndY);

    // get the end element at the new position (use viewport coordinates for elementFromPoint)
    const endElement = document.elementFromPoint(this.selectionEndX, this.selectionEndY);
    console.log('[KeyboardTextHighlight] Element at point:', endElement, 'is in textLayer:', textLayer.contains(endElement));

    if (endElement && textLayer.contains(endElement)) {
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const startOffset = range.startOffset;

      console.log('[KeyboardTextHighlight] Current selection start:', {
        node: startNode,
        text: startNode.textContent?.substring(0, 50),
        offset: startOffset
      });

      // get end position using caret APIs
      // caretPositionFromPoint is standard but not supported in all browsers
      // caretRangeFromPoint is older and supported in more browsers
      let endNode: Node | null = null;
      let endOffset = 0;

      if ((document as any).caretPositionFromPoint) {
        const caretPosition = (document as any).caretPositionFromPoint(this.selectionEndX, this.selectionEndY);
        if (caretPosition) {
          endNode = caretPosition.offsetNode;
          endOffset = caretPosition.offset;
          console.log('[KeyboardTextHighlight] End position from caretPositionFromPoint:', {
            offsetNode: endNode,
            offset: endOffset,
            text: endNode?.textContent?.substring(0, 50)
          });
        }
      } else if ((document as any).caretRangeFromPoint) {
        const caretRange = (document as any).caretRangeFromPoint(this.selectionEndX, this.selectionEndY);
        if (caretRange) {
          endNode = caretRange.startContainer;
          endOffset = caretRange.startOffset;
          console.log('[KeyboardTextHighlight] End position from caretRangeFromPoint:', {
            startContainer: endNode,
            startOffset: endOffset,
            text: endNode?.textContent?.substring(0, 50)
          });
        }
      }

      if (endNode) {
        try {
          // use setBaseAndExtent to handle selection direction with precise offsets
          // to ensure the selection always starts from the original start point
          // and extends to the exact character position at the cursor
          selection.setBaseAndExtent(
            startNode,
            startOffset,
            endNode,
            endOffset
          );
          console.log('[KeyboardTextHighlight] Selection updated successfully with precise offsets');
        } catch (e) {
          console.log('[KeyboardTextHighlight] Error extending selection:', e);
        }
      } else {
        console.log('[KeyboardTextHighlight] No precise position found at point');
      }
    } else {
      console.log('[KeyboardTextHighlight] Element not found or not in textLayer');
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
    console.log('[KeyboardTextHighlight] Emitting cursor position:', position);
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