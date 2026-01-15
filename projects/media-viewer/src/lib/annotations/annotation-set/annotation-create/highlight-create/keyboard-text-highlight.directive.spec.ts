import { ElementRef } from '@angular/core';
import { KeyboardTextHighlightDirective, KeyboardTextHighlightEvent, CursorPosition } from './keyboard-text-highlight.directive';

describe('KeyboardTextHighlightDirective', () => {
  let directive: KeyboardTextHighlightDirective;
  let mockElementRef: ElementRef;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.setAttribute('data-page-number', '1');
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true, configurable: true });

    mockElementRef = new ElementRef(mockElement);
    directive = new KeyboardTextHighlightDirective(mockElementRef);
  });

  afterEach(() => {
    directive.ngOnDestroy();
  });

  describe('cursor movement', () => {
    it('should show cursor when arrow key is pressed and directive is enabled', (done) => {
      directive.enabled = true;
      let cursorPosition: CursorPosition;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        cursorPosition = pos;
        if (pos.visible) {
          expect(pos.visible).toBe(true);
          expect(pos.x).toBe(400); // center of viewport
          expect(pos.y).toBe(300); // center of viewport
          done();
        }
      });

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      directive.onKeyDown(event);
    });

    it('should move cursor up when ArrowUp is pressed', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 2) {
          expect(pos.y).toBeLessThan(300);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' })); // show cursor
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' })); // move up
    });

    it('should move cursor down when ArrowDown is pressed', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 2) {
          expect(pos.y).toBeGreaterThan(300);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });

    it('should move cursor left when ArrowLeft is pressed', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 2) {
          expect(pos.x).toBeLessThan(400);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    it('should move cursor right when ArrowRight is pressed', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 2) {
          expect(pos.x).toBeGreaterThan(400);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });

    it('should move cursor by larger increment when shift is held', (done) => {
      directive.enabled = true;
      directive.incrementMedium = 10;
      directive.incrementLarge = 20;
      let emitCount = 0;
      let firstY: number;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 1) {
          firstY = pos.y;
        }
        if (emitCount === 2) {
          const diff = firstY - pos.y;
          expect(diff).toBe(20);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true }));
    });

    it('should hide cursor when Escape is pressed', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 2) {
          expect(pos.visible).toBe(false);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    it('should hide cursor on blur if not selecting', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 2) {
          expect(pos.visible).toBe(false);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      directive.onBlur();
    });

    it('should not move cursor beyond viewport bounds', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount >= 1 && pos.visible) {
          expect(pos.x).toBeGreaterThanOrEqual(0);
          expect(pos.x).toBeLessThanOrEqual(800);
          expect(pos.y).toBeGreaterThanOrEqual(0);
          expect(pos.y).toBeLessThanOrEqual(600);
          if (emitCount === 10) {
            done();
          }
        }
      });

      // move cursor to edges
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      for (let i = 0; i < 50; i++) {
        directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      }
    });
  });

  describe('text selection', () => {
    beforeEach(() => {
      // create mock selection
      const mockSelection = {
        removeAllRanges: jasmine.createSpy('removeAllRanges'),
        addRange: jasmine.createSpy('addRange'),
        getRangeAt: jasmine.createSpy('getRangeAt').and.returnValue({
          startContainer: document.createTextNode('test'),
          startOffset: 0,
          collapsed: false
        }),
        rangeCount: 1,
        setBaseAndExtent: jasmine.createSpy('setBaseAndExtent')
      } as any;
      spyOn(window, 'getSelection').and.returnValue(mockSelection);

      // mock caretRangeFromPoint
      (document as any).caretRangeFromPoint = jasmine.createSpy('caretRangeFromPoint').and.returnValue({
        startContainer: document.createTextNode('test'),
        startOffset: 0
      });
    });

    it('should start text selection when Enter is pressed with cursor visible', () => {
      directive.enabled = true;
      spyOn(directive.selectionStarted, 'emit');

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(directive.selectionStarted.emit).toHaveBeenCalled();
    });

    it('should expand text selection when arrow keys are pressed during selection', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.selectionUpdated.subscribe((event: KeyboardTextHighlightEvent) => {
        emitCount++;
        if (emitCount === 1) {
          expect(event.page).toBe(1);
          expect(event.startX).toBeDefined();
          expect(event.endX).toBeDefined();
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });

    it('should use small increment for selection expansion by default', (done) => {
      directive.enabled = true;
      directive.incrementSmall = 5;
      let startX: number;

      let selectionCursorEmits = 0;
      directive.selectionCursorPositionChanged.subscribe((pos: CursorPosition) => {
        selectionCursorEmits++;
        if (selectionCursorEmits === 1) {
          startX = pos.x;
        }
        if (selectionCursorEmits === 2) {
          expect(pos.x - startX).toBe(5);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });

    it('should use large increment for selection expansion with shift key', (done) => {
      directive.enabled = true;
      directive.incrementSmall = 5;
      directive.incrementLarge = 20;
      let startX: number;

      let selectionCursorEmits = 0;
      directive.selectionCursorPositionChanged.subscribe((pos: CursorPosition) => {
        selectionCursorEmits++;
        if (selectionCursorEmits === 1) {
          startX = pos.x;
        }
        if (selectionCursorEmits === 2) {
          expect(pos.x - startX).toBe(20);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true }));
    });

    it('should confirm text selection when Enter is pressed during selection', (done) => {
      directive.enabled = true;

      directive.selectionConfirmed.subscribe(() => {
        done();
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    it('should cancel text selection when Escape is pressed during selection', (done) => {
      directive.enabled = true;

      directive.selectionCancelled.subscribe(() => {
        done();
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    it('should hide selection cursor when selection is confirmed', (done) => {
      directive.enabled = true;
      let confirmEmitted = false;

      directive.selectionConfirmed.subscribe(() => {
        confirmEmitted = true;
      });

      directive.selectionCursorPositionChanged.subscribe((pos: CursorPosition) => {
        if (confirmEmitted && !pos.visible) {
          expect(pos.visible).toBe(false);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    it('should hide selection cursor when selection is cancelled', (done) => {
      directive.enabled = true;
      let cancelEmitted = false;

      directive.selectionCancelled.subscribe(() => {
        cancelEmitted = true;
      });

      directive.selectionCursorPositionChanged.subscribe((pos: CursorPosition) => {
        if (cancelEmitted && !pos.visible) {
          expect(pos.visible).toBe(false);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    it('should clear window selection when cancelling', (done) => {
      directive.enabled = true;
      const mockSelection = window.getSelection();

      directive.selectionCancelled.subscribe(() => {
        expect(mockSelection.removeAllRanges).toHaveBeenCalled();
        done();
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
  });

  describe('enabled state', () => {
    it('should not respond to keys when disabled', () => {
      directive.enabled = false;
      let cursorEmitted = false;

      directive.cursorPositionChanged.subscribe(() => {
        cursorEmitted = true;
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(cursorEmitted).toBe(false);
    });

    it('should respond to keys when enabled', (done) => {
      directive.enabled = true;

      directive.cursorPositionChanged.subscribe(() => {
        done();
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });
  });

  describe('reset', () => {
    it('should reset all state when reset is called', (done) => {
      directive.enabled = true;
      let emitCount = 0;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 2) {
          expect(pos.visible).toBe(false);
          expect(pos.x).toBeUndefined();
          expect(pos.y).toBeUndefined();
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      directive.reset();
    });
  });

  describe('text selection expansion with vertical arrows', () => {
    beforeEach(() => {
      const mockSelection = {
        removeAllRanges: jasmine.createSpy('removeAllRanges'),
        addRange: jasmine.createSpy('addRange'),
        getRangeAt: jasmine.createSpy('getRangeAt').and.returnValue({
          startContainer: document.createTextNode('test'),
          startOffset: 0,
          collapsed: false
        }),
        rangeCount: 1,
        setBaseAndExtent: jasmine.createSpy('setBaseAndExtent')
      } as any;
      spyOn(window, 'getSelection').and.returnValue(mockSelection);

      (document as any).caretRangeFromPoint = jasmine.createSpy('caretRangeFromPoint').and.returnValue({
        startContainer: document.createTextNode('test'),
        startOffset: 0
      });
    });

    it('should expand selection downward when ArrowDown is pressed during selection', (done) => {
      directive.enabled = true;
      let startY: number;

      let selectionCursorEmits = 0;
      directive.selectionCursorPositionChanged.subscribe((pos: CursorPosition) => {
        selectionCursorEmits++;
        if (selectionCursorEmits === 1) {
          startY = pos.y;
        }
        if (selectionCursorEmits === 2) {
          expect(pos.y).toBeGreaterThan(startY);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });

    it('should expand selection upward when ArrowUp is pressed during selection', (done) => {
      directive.enabled = true;
      let startY: number;

      let selectionCursorEmits = 0;
      directive.selectionCursorPositionChanged.subscribe((pos: CursorPosition) => {
        selectionCursorEmits++;
        if (selectionCursorEmits === 1) {
          startY = pos.y;
        }
        if (selectionCursorEmits === 2) {
          expect(pos.y).toBeLessThan(startY);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });

    it('should expand selection leftward when ArrowLeft is pressed during selection', (done) => {
      directive.enabled = true;
      let startX: number;

      let selectionCursorEmits = 0;
      directive.selectionCursorPositionChanged.subscribe((pos: CursorPosition) => {
        selectionCursorEmits++;
        if (selectionCursorEmits === 1) {
          startX = pos.x;
        }
        if (selectionCursorEmits === 2) {
          expect(pos.x).toBeLessThan(startX);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });
  });

  describe('caretPositionFromPoint fallback', () => {
    beforeEach(() => {
      const mockSelection = {
        removeAllRanges: jasmine.createSpy('removeAllRanges'),
        addRange: jasmine.createSpy('addRange'),
        getRangeAt: jasmine.createSpy('getRangeAt').and.returnValue({
          startContainer: document.createTextNode('test'),
          startOffset: 0,
          collapsed: false
        }),
        rangeCount: 1,
        setBaseAndExtent: jasmine.createSpy('setBaseAndExtent')
      } as any;
      spyOn(window, 'getSelection').and.returnValue(mockSelection);
    });

    it('should use caretPositionFromPoint when available', () => {
      const mockCaretPosition = {
        offsetNode: document.createTextNode('test text'),
        offset: 5
      };
      (document as any).caretPositionFromPoint = jasmine.createSpy('caretPositionFromPoint').and.returnValue(mockCaretPosition);
      (document as any).caretRangeFromPoint = undefined;

      directive.enabled = true;
      spyOn(directive.selectionStarted, 'emit');

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect((document as any).caretPositionFromPoint).toHaveBeenCalled();
      expect(directive.selectionStarted.emit).toHaveBeenCalled();
    });

    it('should update selection using caretPositionFromPoint when available', (done) => {
      const mockCaretPosition = {
        offsetNode: document.createTextNode('test text'),
        offset: 5
      };
      (document as any).caretPositionFromPoint = jasmine.createSpy('caretPositionFromPoint').and.returnValue(mockCaretPosition);
      (document as any).caretRangeFromPoint = undefined;

      directive.enabled = true;

      directive.selectionUpdated.subscribe(() => {
        expect((document as any).caretPositionFromPoint).toHaveBeenCalled();
        done();
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });
  });

  describe('page number detection', () => {
    it('should return default page number when no page attribute found', () => {
      const elementWithoutPage = document.createElement('div');
      const mockElementRef = new ElementRef(elementWithoutPage);
      const directiveWithoutPage = new KeyboardTextHighlightDirective(mockElementRef);

      directiveWithoutPage.enabled = true;
      spyOn(directiveWithoutPage.selectionStarted, 'emit');

      const mockSelection = {
        removeAllRanges: jasmine.createSpy('removeAllRanges'),
        addRange: jasmine.createSpy('addRange'),
        getRangeAt: jasmine.createSpy('getRangeAt').and.returnValue({
          startContainer: document.createTextNode('test'),
          startOffset: 0,
          collapsed: false
        }),
        rangeCount: 1,
        setBaseAndExtent: jasmine.createSpy('setBaseAndExtent')
      } as any;
      spyOn(window, 'getSelection').and.returnValue(mockSelection);

      (document as any).caretRangeFromPoint = jasmine.createSpy('caretRangeFromPoint').and.returnValue({
        startContainer: document.createTextNode('test'),
        startOffset: 0
      });

      directiveWithoutPage.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(directiveWithoutPage.selectionStarted.emit).toHaveBeenCalled();
      directiveWithoutPage.ngOnDestroy();
    });
  });
});