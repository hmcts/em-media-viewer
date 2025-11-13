import { ElementRef } from '@angular/core';
import { KeyboardNavDirective } from './keyboard-nav.directive';

describe('KeyboardNavDirective', () => {
  let directive: KeyboardNavDirective;
  let hostElement: HTMLElement;
  let elementRef: ElementRef<HTMLElement>;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let button3: HTMLButtonElement;

  beforeEach(() => {
    hostElement = document.createElement('div');
    document.body.appendChild(hostElement);

    button1 = document.createElement('button');
    button1.id = 'btn1';
    button2 = document.createElement('button');
    button2.id = 'btn2';
    button3 = document.createElement('button');
    button3.id = 'btn3';

    hostElement.appendChild(button1);
    hostElement.appendChild(button2);
    hostElement.appendChild(button3);

    elementRef = new ElementRef<HTMLElement>(hostElement);
    directive = new KeyboardNavDirective(elementRef);
  });

  afterEach(() => {
    document.body.removeChild(hostElement);
    directive.ngOnDestroy();
  });

  describe('initialization', () => {
    it('should create directive', () => {
      expect(directive).toBeTruthy();
    });

    it('should default to horizontal orientation', () => {
      expect(directive.orientation).toBe('horizontal');
    });

    it('should set custom orientation', () => {
      directive.orientation = 'vertical';
      expect(directive.orientation).toBe('vertical');
    });

    it('should update focusable items on init', () => {
      directive.ngOnInit();
      expect(button1.getAttribute('tabindex')).toBe('0');
      expect(button2.getAttribute('tabindex')).toBe('0');
      expect(button3.getAttribute('tabindex')).toBe('0');
    });

    it('should set up mutation observer on init', () => {
      directive.ngOnInit();
      expect(directive['mutationObserver']).toBeDefined();
    });
  });

  describe('ngOnDestroy', () => {
    it('should disconnect mutation observer', () => {
      directive.ngOnInit();
      const disconnectSpy = spyOn(directive['mutationObserver'], 'disconnect');
      directive.ngOnDestroy();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe('focusable items management', () => {
    it('should filter out disabled buttons', () => {
      directive.ngOnInit();
      button2.setAttribute('disabled', 'true');

      // trigger mutation observer
      directive['updateFocusableItems']();

      expect(directive['focusableItems'].length).toBe(2);
      expect(directive['focusableItems']).toContain(button1);
      expect(directive['focusableItems']).not.toContain(button2);
      expect(directive['focusableItems']).toContain(button3);
    });

    it('should filter out hidden buttons', () => {
      directive.ngOnInit();
      button2.style.display = 'none';

      directive['updateFocusableItems']();

      expect(directive['focusableItems'].length).toBe(2);
      expect(directive['focusableItems']).not.toContain(button2);
    });

    it('should filter out buttons with visibility hidden', () => {
      directive.ngOnInit();
      button2.style.visibility = 'hidden';

      directive['updateFocusableItems']();

      expect(directive['focusableItems'].length).toBe(2);
      expect(directive['focusableItems']).not.toContain(button2);
    });

    it('should filter out buttons in hidden parent elements', () => {
      directive.ngOnInit();
      const parentDiv = document.createElement('div');
      parentDiv.style.display = 'none';
      hostElement.appendChild(parentDiv);
      const hiddenButton = document.createElement('button');
      parentDiv.appendChild(hiddenButton);

      directive['updateFocusableItems']();

      expect(directive['focusableItems']).not.toContain(hiddenButton);
    });

    it('should update focusable items when DOM changes', (done) => {
      directive.ngOnInit();
      const updateSpy = spyOn<any>(directive, 'updateFocusableItems').and.callThrough();

      const newButton = document.createElement('button');
      hostElement.appendChild(newButton);
    
      requestAnimationFrame(() => {
        expect(updateSpy).toHaveBeenCalled();
        expect(directive['focusableItems'].length).toBe(4);
        expect(directive['focusableItems']).toContain(newButton);
        done();
      });
    });
  });

  describe('horizontal orientation keyboard navigation', () => {
    beforeEach(() => {
      directive.orientation = 'horizontal';
      directive.ngOnInit();
      button1.focus();
    });

    it('should focus next item on ArrowRight', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button2);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should focus previous item on ArrowLeft', () => {
      button2.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      Object.defineProperty(event, 'target', { value: button2, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button1);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should wrap to first item when pressing ArrowRight on last item', () => {
      button3.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button3, writable: false });

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button1);
    });

    it('should wrap to last item when pressing ArrowLeft on first item', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button3);
    });

    it('should not respond to ArrowDown in horizontal mode', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      directive.onKeyDown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should not respond to ArrowUp in horizontal mode', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      directive.onKeyDown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('vertical orientation keyboard navigation', () => {
    beforeEach(() => {
      directive.orientation = 'vertical';
      directive.ngOnInit();
      button1.focus();
    });

    it('should focus next item on ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button2);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should focus previous item on ArrowUp', () => {
      button2.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      Object.defineProperty(event, 'target', { value: button2, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button1);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should wrap to first item when pressing ArrowDown on last item', () => {
      button3.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      Object.defineProperty(event, 'target', { value: button3, writable: false });

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button1);
    });

    it('should wrap to last item when pressing ArrowUp on first item', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button3);
    });

    it('should not respond to ArrowRight in vertical mode', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      directive.onKeyDown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should not respond to ArrowLeft in vertical mode', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      directive.onKeyDown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

    describe('Home and End key navigation', () => {
    beforeEach(() => {
      directive.ngOnInit();
      button2.focus();
    });

    it('should focus first item on Home key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      Object.defineProperty(event, 'target', { value: button2, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button1);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should focus last item on End key', () => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      Object.defineProperty(event, 'target', { value: button2, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      directive.onKeyDown(event);

      expect(document.activeElement).toBe(button3);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('Enter and Space key activation', () => {
    beforeEach(() => {
      directive.ngOnInit();
    });

    it('should click button on Enter key', () => {
      const clickSpy = spyOn(button1, 'click');
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should click button on Space key', () => {
      const clickSpy = spyOn(button1, 'click');
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: ' ' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should emit itemActivated event on Enter', (done) => {
      directive.itemActivated.subscribe((element: HTMLElement) => {
        expect(element).toBe(button1);
        done();
      });

      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);
    });

    it('should emit itemActivated event on Space', (done) => {
      directive.itemActivated.subscribe((element: HTMLElement) => {
        expect(element).toBe(button1);
        done();
      });

      button1.focus();
      const event = new KeyboardEvent('keydown', { key: ' ' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);
    });
  });

  describe('itemFocused event emission', () => {
    beforeEach(() => {
      directive.orientation = 'horizontal';
      directive.ngOnInit();
    });

    it('should emit itemFocused when focusing next item', (done) => {
      directive.itemFocused.subscribe((element: HTMLElement) => {
        expect(element).toBe(button2);
        done();
      });

      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);
    });

    it('should emit itemFocused when focusing previous item', (done) => {
      directive.itemFocused.subscribe((element: HTMLElement) => {
        expect(element).toBe(button1);
        done();
      });

      button2.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      Object.defineProperty(event, 'target', { value: button2, writable: false });

      directive.onKeyDown(event);
    });

    it('should emit itemFocused on Home key', (done) => {
      directive.itemFocused.subscribe((element: HTMLElement) => {
        expect(element).toBe(button1);
        done();
      });

      button2.focus();
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      Object.defineProperty(event, 'target', { value: button2, writable: false });

      directive.onKeyDown(event);
    });

    it('should emit itemFocused on End key', (done) => {
      directive.itemFocused.subscribe((element: HTMLElement) => {
        expect(element).toBe(button3);
        done();
      });

      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'End' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);
    });
  });

  describe('tabindex management with arrow keys', () => {
    beforeEach(() => {
      directive.orientation = 'horizontal';
      directive.ngOnInit();
    });

    it('should apply roving tabindex after first arrow key use', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);

      expect(button1.getAttribute('tabindex')).toBe('-1');
      expect(button2.getAttribute('tabindex')).toBe('0');
      expect(button3.getAttribute('tabindex')).toBe('-1');
    });

    it('should maintain roving tabindex on subsequent arrow key presses', () => {
      button1.focus();
      let event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);

      event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button2, writable: false });

      directive.onKeyDown(event);

      expect(button1.getAttribute('tabindex')).toBe('-1');
      expect(button2.getAttribute('tabindex')).toBe('-1');
      expect(button3.getAttribute('tabindex')).toBe('0');
    });

    it('should reset all tabindex to 0 when Tab key is pressed', () => {
      button1.focus();
      let event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });

      directive.onKeyDown(event);

      expect(button2.getAttribute('tabindex')).toBe('0');
      expect(button1.getAttribute('tabindex')).toBe('-1');

      event = new KeyboardEvent('keydown', { key: 'Tab' });
      Object.defineProperty(event, 'target', { value: button2, writable: false });

      directive.onKeyDown(event);

      expect(button1.getAttribute('tabindex')).toBe('0');
      expect(button2.getAttribute('tabindex')).toBe('0');
      expect(button3.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('edge cases', () => {
    it('should handle keydown on non-focusable element gracefully', () => {
      directive.ngOnInit();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      Object.defineProperty(event, 'target', { value: hostElement, writable: false });
      directive.onKeyDown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should handle empty focusable items array', () => {
      while (hostElement.firstChild) {
        hostElement.removeChild(hostElement.firstChild);
      }

      directive.ngOnInit();

      expect(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
        Object.defineProperty(event, 'target', { value: document.createElement('button'), writable: false });
        directive.onKeyDown(event);
      }).not.toThrow();
    });

    it('should not focus when focusItemAtIndex receives invalid index', () => {
      directive.ngOnInit();
      button1.focus();

      directive['focusItemAtIndex'](-1);
      expect(document.activeElement).toBe(button1);

      directive['focusItemAtIndex'](999);
      expect(document.activeElement).toBe(button1);
    });

    it('should handle focus methods with empty items array', () => {
      directive['focusableItems'] = [];

      expect(() => directive['focusNext'](0)).not.toThrow();
      expect(() => directive['focusPrevious'](0)).not.toThrow();
      expect(() => directive['focusFirst']()).not.toThrow();
      expect(() => directive['focusLast']()).not.toThrow();
    });
  });

  describe('event propagation', () => {
    beforeEach(() => {
      directive.orientation = 'horizontal';
      directive.ngOnInit();
    });

    it('should prevent default and stop propagation for handled keys', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      directive.onKeyDown(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should not prevent default or stop propagation for unhandled keys', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'a' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      directive.onKeyDown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(stopPropagationSpy).not.toHaveBeenCalled();
    });

    it('should not prevent default for Tab key', () => {
      button1.focus();
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      Object.defineProperty(event, 'target', { value: button1, writable: false });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      directive.onKeyDown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
