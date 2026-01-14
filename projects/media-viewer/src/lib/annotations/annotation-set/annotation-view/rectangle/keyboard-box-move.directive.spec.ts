import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { KeyboardBoxMoveDirective } from './keyboard-box-move.directive';

describe('KeyboardBoxMoveDirective', () => {
  let directive: KeyboardBoxMoveDirective;
  let mockElementRef: ElementRef;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.style.position = 'absolute';
    mockElement.style.left = '100px';
    mockElement.style.top = '100px';
    mockElement.style.width = '50px';
    mockElement.style.height = '50px';

    Object.defineProperty(mockElement, 'offsetWidth', {
      configurable: true,
      value: 50
    });
    Object.defineProperty(mockElement, 'offsetHeight', {
      configurable: true,
      value: 50
    });

    mockElementRef = new ElementRef(mockElement);
    directive = new KeyboardBoxMoveDirective(mockElementRef);
  });

  afterEach(() => {
    directive.ngOnDestroy();
  });

  describe('keyboard movement', () => {
    it('should move box up when ArrowUp is pressed', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementSmall = 1;

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      directive.onKeyDown(event);

      expect(mockElement.style.top).toBe('99px');
      tick(500); // wait for debounce
    }));

    it('should move box down when ArrowDown is pressed', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementSmall = 1;

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      directive.onKeyDown(event);

      expect(mockElement.style.top).toBe('101px');
      tick(500);
    }));

    it('should move box left when ArrowLeft is pressed', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementSmall = 1;

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      directive.onKeyDown(event);

      expect(mockElement.style.left).toBe('99px');
      tick(500);
    }));

    it('should move box right when ArrowRight is pressed', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementSmall = 1;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      directive.onKeyDown(event);

      expect(mockElement.style.left).toBe('101px');
      tick(500);
    }));

    it('should move by larger increment when shift is held', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementSmall = 1;
      directive.incrementLarge = 10;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true });
      directive.onKeyDown(event);

      expect(mockElement.style.left).toBe('110px');
      tick(500);
    }));

    it('should not move when disabled', fakeAsync(() => {
      directive.enabled = false;
      directive.incrementSmall = 1;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      directive.onKeyDown(event);

      expect(mockElement.style.left).toBe('100px');
      tick(500);
    }));
  });

  describe('movement bounds', () => {
    it('should not move box beyond left boundary', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementLarge = 200;
      directive.movementBounds = {
        containerWidth: 500,
        containerHeight: 500
      };

      mockElement.style.left = '10px';
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', shiftKey: true });
      directive.onKeyDown(event);

      expect(mockElement.style.left).toBe('0px');
      tick(500);
    }));

    it('should not move box beyond top boundary', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementLarge = 200;
      directive.movementBounds = {
        containerWidth: 500,
        containerHeight: 500
      };

      mockElement.style.top = '10px';
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true });
      directive.onKeyDown(event);

      expect(mockElement.style.top).toBe('0px');
      tick(500);
    }));

    it('should not move box beyond right boundary', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementLarge = 200;
      directive.movementBounds = {
        containerWidth: 500,
        containerHeight: 500
      };

      mockElement.style.left = '440px'; // box is 50px wide, so max left is 450
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true });
      directive.onKeyDown(event);

      expect(mockElement.style.left).toBe('450px'); // maxed to 450 (500 - 50)
      tick(500);
    }));

    it('should not move box beyond bottom boundary', fakeAsync(() => {
      directive.enabled = true;
      directive.incrementLarge = 200;
      directive.movementBounds = {
        containerWidth: 500,
        containerHeight: 500
      };

      mockElement.style.top = '440px';
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true });
      directive.onKeyDown(event);

      expect(mockElement.style.top).toBe('450px');
      tick(500);
    }));
  });

  describe('keyboard moving state', () => {
    it('should emit keyboardMovingChange when movement starts', fakeAsync(() => {
      directive.enabled = true;
      let movingState: boolean;

      directive.keyboardMovingChange.subscribe((state: boolean) => {
        movingState = state;
      });

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      directive.onKeyDown(event);

      expect(movingState).toBe(true);
      tick(500);
    }));

    it('should emit keyboardMovingChange false after debounce period', fakeAsync(() => {
      directive.enabled = true;
      let movingStates: boolean[] = [];

      directive.keyboardMovingChange.subscribe((state: boolean) => {
        movingStates.push(state);
      });

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      directive.onKeyDown(event);

      tick(500); // wait for debounce

      expect(movingStates.length).toBe(2);
      expect(movingStates[0]).toBe(true);
      expect(movingStates[1]).toBe(false);
    }));

    it('should only emit one moving=true event for multiple rapid key presses', fakeAsync(() => {
      directive.enabled = true;
      let movingStates: boolean[] = [];

      directive.keyboardMovingChange.subscribe((state: boolean) => {
        movingStates.push(state);
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      tick(100);
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      tick(100);
      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      tick(500); // wait for debounce

      expect(movingStates.filter(states => states === true).length).toBe(1);
      expect(movingStates[movingStates.length - 1]).toBe(false); // ends with false
    }));
  });

  describe('stopped event', () => {
    it('should dispatch stopped event after debounce period', fakeAsync(() => {
      directive.enabled = true;
      let stoppedEventFired = false;

      mockElement.addEventListener('stopped', () => {
        stoppedEventFired = true;
      });

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      directive.onKeyDown(event);

      expect(stoppedEventFired).toBe(false);
      tick(500);
      expect(stoppedEventFired).toBe(true);
    }));

    it('should restore focus after stopped event if element was focused', fakeAsync(() => {
      directive.enabled = true;
      document.body.appendChild(mockElement);
      mockElement.tabIndex = 0;
      mockElement.focus();

      expect(document.activeElement).toBe(mockElement);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      directive.onKeyDown(event);

      tick(500); // wait for debounce
      tick(100); // wait for focus restoration

      expect(document.activeElement).toBe(mockElement);

      document.body.removeChild(mockElement);
    }));
  });

  describe('delete functionality', () => {
    it('should emit boxDelete when Delete key is pressed', () => {
      let deleteEmitted = false;

      directive.boxDelete.subscribe(() => {
        deleteEmitted = true;
      });

      const event = new KeyboardEvent('keydown', { key: 'Delete' });
      directive.onKeyDown(event);

      expect(deleteEmitted).toBe(true);
    });

    it('should emit boxDelete when Backspace key is pressed', () => {
      let deleteEmitted = false;

      directive.boxDelete.subscribe(() => {
        deleteEmitted = true;
      });

      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      directive.onKeyDown(event);

      expect(deleteEmitted).toBe(true);
    });

    it('should emit boxDelete even when disabled', () => {
      directive.enabled = false;
      let deleteEmitted = false;

      directive.boxDelete.subscribe(() => {
        deleteEmitted = true;
      });

      const event = new KeyboardEvent('keydown', { key: 'Delete' });
      directive.onKeyDown(event);

      expect(deleteEmitted).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should unsubscribe on destroy', fakeAsync(() => {
      directive.enabled = true;
      let emitCount = 0;
      let subscription = directive.keyboardMovingChange.subscribe(() => {
        emitCount++;
      });

      directive.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      tick(500);

      const countAfterFirstMove = emitCount;

      subscription.unsubscribe();
      directive.ngOnDestroy();

      expect(emitCount).toBe(countAfterFirstMove);
    }));
  });
});