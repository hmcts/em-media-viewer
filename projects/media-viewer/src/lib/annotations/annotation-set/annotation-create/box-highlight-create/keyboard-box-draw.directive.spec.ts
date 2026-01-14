import { ElementRef } from '@angular/core';
import { KeyboardBoxDrawDirective, KeyboardBoxDrawEvent, CursorPosition } from './keyboard-box-draw.directive';

describe('KeyboardBoxDrawDirective', () => {
  let directive: KeyboardBoxDrawDirective;
  let mockElementRef: ElementRef;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.style.width = '800px';
    mockElement.style.height = '600px';
    Object.defineProperty(mockElement, 'getBoundingClientRect', {
      value: () => ({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        right: 800,
        bottom: 600
      })
    });

    mockElementRef = new ElementRef(mockElement);
    directive = new KeyboardBoxDrawDirective(mockElementRef);
  });

  afterEach(() => {
    directive.ngOnDestroy();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  describe('cursor movement', () => {
    it('should show cursor when arrow key is pressed and directive is enabled', (done) => {
      directive.enabled = true;
      let cursorPosition: CursorPosition;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        cursorPosition = pos;
        if (pos.visible) {
          expect(pos.visible).toBe(true);
          expect(pos.x).toBe(400); // center of 800px width
          expect(pos.y).toBe(300); // center of 600px height
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
      directive.incrementMedium = 5;
      directive.incrementLarge = 10;
      let emitCount = 0;
      let firstY: number;

      directive.cursorPositionChanged.subscribe((pos: CursorPosition) => {
        emitCount++;
        if (emitCount === 1) {
          firstY = pos.y;
        }
        if (emitCount === 2) {
          const diff = firstY - pos.y;
          expect(diff).toBe(10);
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

    it('should hide cursor on blur if not drawing', (done) => {
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
  });

  describe('box drawing', () => {
    it('should start drawing when Enter is pressed with cursor visible', (done) => {
      directive.enabled = true;
      directive.minBoxSize = 10;

      directive.drawingStarted.subscribe((event: KeyboardBoxDrawEvent) => {
        expect(event.startX).toBe(400);
        expect(event.startY).toBe(300);
        expect(event.width).toBe(10);
        expect(event.height).toBe(10);
        done();
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    it('should expand box width when ArrowRight is pressed while drawing', (done) => {
      directive.enabled = true;
      directive.minBoxSize = 10;
      directive.incrementSmall = 1;

      let drawEvents = 0;
      directive.drawingStarted.subscribe(() => {
        drawEvents++;
      });

      directive.drawingUpdated.subscribe((event: KeyboardBoxDrawEvent) => {
        if (drawEvents === 1) {
          expect(event.width).toBe(11);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' })); // start drawing
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' })); // expand width
    });

    it('should shrink box width when ArrowLeft is pressed while drawing', (done) => {
      directive.enabled = true;
      directive.minBoxSize = 10;
      directive.incrementSmall = 1;

      let drawEvents = 0;
      directive.drawingStarted.subscribe(() => {
        drawEvents++;
      });

      directive.drawingUpdated.subscribe((event: KeyboardBoxDrawEvent) => {
        if (drawEvents === 1 && event.width === 11) {
          // first expand
        } else if (drawEvents === 1 && event.width === 10) {
          expect(event.width).toBe(10); // back to min
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' })); // start drawing
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' })); // expand
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' })); // shrink
    });

    it('should expand box height when ArrowDown is pressed while drawing', (done) => {
      directive.enabled = true;
      directive.minBoxSize = 10;
      directive.incrementSmall = 1;

      let drawEvents = 0;
      directive.drawingStarted.subscribe(() => {
        drawEvents++;
      });

      directive.drawingUpdated.subscribe((event: KeyboardBoxDrawEvent) => {
        if (drawEvents === 1) {
          expect(event.height).toBe(11);
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });

    it('should shrink box height when ArrowUp is pressed while drawing', (done) => {
      directive.enabled = true;
      directive.minBoxSize = 10;
      directive.incrementSmall = 1;

      let drawEvents = 0;
      directive.drawingStarted.subscribe(() => {
        drawEvents++;
      });

      directive.drawingUpdated.subscribe((event: KeyboardBoxDrawEvent) => {
        if (drawEvents === 1 && event.height === 11) {
          // first expand
        } else if (drawEvents === 1 && event.height === 10) {
          expect(event.height).toBe(10); // back to min
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });

    it('should not shrink below minBoxSize', (done) => {
      directive.enabled = true;
      directive.minBoxSize = 10;
      directive.incrementSmall = 5;

      let updateCount = 0;

      directive.drawingUpdated.subscribe((event: KeyboardBoxDrawEvent) => {
        expect(event.width).toBeGreaterThanOrEqual(10);
        expect(event.height).toBeGreaterThanOrEqual(10);
        updateCount++;
        if (updateCount === 2) {
          done();
        }
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });

    it('should confirm drawing when Enter is pressed while drawing', (done) => {
      directive.enabled = true;

      directive.drawingConfirmed.subscribe((event: KeyboardBoxDrawEvent) => {
        expect(event).toBeDefined();
        expect(event.width).toBeGreaterThan(0);
        expect(event.height).toBeGreaterThan(0);
        done();
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    it('should cancel drawing when Escape is pressed while drawing', (done) => {
      directive.enabled = true;

      directive.drawingCancelled.subscribe(() => {
        expect(true).toBe(true);
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
});
