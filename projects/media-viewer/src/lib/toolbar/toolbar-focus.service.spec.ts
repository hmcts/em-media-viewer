import { fakeAsync, tick } from '@angular/core/testing';
import { ToolbarFocusService } from './toolbar-focus.service';

describe('ToolbarFocusService', () => {
  let service: ToolbarFocusService;
  let toolbar: HTMLElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let button3: HTMLButtonElement;

  beforeEach(() => {
    service = new ToolbarFocusService();

    toolbar = document.createElement('div');
    toolbar.id = 'test-toolbar';

    button1 = document.createElement('button');
    button1.id = 'btn1';
    button1.setAttribute('tabindex', '0');

    button2 = document.createElement('button');
    button2.id = 'btn2';
    button2.setAttribute('tabindex', '-1');

    button3 = document.createElement('button');
    button3.id = 'btn3';
    button3.setAttribute('tabindex', '-1');

    toolbar.appendChild(button1);
    toolbar.appendChild(button2);
    toolbar.appendChild(button3);

    document.body.appendChild(toolbar);
  });

  afterEach(() => {
    if (toolbar && toolbar.parentNode) {
      document.body.removeChild(toolbar);
    }
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('focusToolbarButton', () => {
    it('should focus toolbar element when it is a button', fakeAsync(() => {
      const singleButton = document.createElement('button');
      singleButton.id = 'single-btn';
      document.body.appendChild(singleButton);

      const focusSpy = spyOn(singleButton, 'focus').and.callThrough();
      service.focusToolbarButton('#single-btn');

      tick();

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(singleButton);
      document.body.removeChild(singleButton);
    }));

    it('should focus specific button by id when buttonId is provided', fakeAsync(() => {
      const focusSpy = spyOn(button2, 'focus').and.callThrough();;
      service.focusToolbarButton('#test-toolbar', 'btn2');

      tick();

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(button2);
    }));

    it('should focus first tabbable button when buttonId is not provided', fakeAsync(() => {
      const focusSpy = spyOn(button1, 'focus').and.callThrough();;
      service.focusToolbarButton('#test-toolbar');

      tick();

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(button1);
    }));

    it('should not throw error when toolbar element is not found', fakeAsync(() => {
      expect(() => {
        service.focusToolbarButton('#non-existent-toolbar');
      }).not.toThrow();

      tick();
    }));

    it('should not throw error when buttonId is not found', fakeAsync(() => {
      expect(() => {
        service.focusToolbarButton('#test-toolbar', 'non-existent-btn');
      }).not.toThrow();

      tick();
    }));

    it('should use custom delay when provided', fakeAsync(() => {
      const focusSpy = spyOn(button1, 'focus').and.callThrough();;
      const delay = 100;

      service.focusToolbarButton('#test-toolbar', undefined, delay);

      tick(delay);

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(button1);
    }));

    it('should default to 0 delay when delay is not provided', fakeAsync(() => {
      const focusSpy = spyOn(button1, 'focus').and.callThrough();;
      service.focusToolbarButton('#test-toolbar');

      tick();

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(button1);
    }));

    it('should handle toolbar with no tabbable buttons', fakeAsync(() => {
      button1.setAttribute('tabindex', '-1');

      expect(() => {
        service.focusToolbarButton('#test-toolbar');
      }).not.toThrow();

      tick();
    }));

    it('should prioritize buttonId over tabbable button', fakeAsync(() => {
      const focusSpy1 = spyOn(button1, 'focus').and.callThrough();;
      const focusSpy3 = spyOn(button3, 'focus').and.callThrough();;

      service.focusToolbarButton('#test-toolbar', 'btn3');

      tick();

      expect(focusSpy1).not.toHaveBeenCalled();
      expect(focusSpy3).toHaveBeenCalled();
      expect(document.activeElement).toBe(button3);
    }));

    it('should handle button id with hyphens correctly', fakeAsync(() => {
      const specialButton = document.createElement('button');
      specialButton.id = 'btn-special-test';
      toolbar.appendChild(specialButton);

      const focusSpy = spyOn(specialButton, 'focus').and.callThrough();
      service.focusToolbarButton('#test-toolbar', 'btn-special-test');

      tick();

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(specialButton);
    }));

    it('should work with toolbar selector using class', fakeAsync(() => {
      toolbar.className = 'toolbar-class';
      const focusSpy = spyOn(button1, 'focus').and.callThrough();;

      service.focusToolbarButton('.toolbar-class');

      tick();

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(button1);
    }));

    it('should work with complex toolbar selector', fakeAsync(() => {
      const container = document.createElement('div');
      container.className = 'container';
      const innerToolbar = document.createElement('div');
      innerToolbar.className = 'inner-toolbar';
      const innerButton = document.createElement('button');
      innerButton.setAttribute('tabindex', '0');

      innerToolbar.appendChild(innerButton);
      container.appendChild(innerToolbar);
      document.body.appendChild(container);

      const focusSpy = spyOn(innerButton, 'focus').and.callThrough();;
      service.focusToolbarButton('.container .inner-toolbar');

      tick();

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(innerButton);
      document.body.removeChild(container);
    }));
  });

  describe('integration scenarios', () => {
    it('should handle rapid successive calls', fakeAsync(() => {
      const focusSpy1 = spyOn(button1, 'focus').and.callThrough();;
      const focusSpy2 = spyOn(button2, 'focus').and.callThrough();;
      const focusSpy3 = spyOn(button3, 'focus').and.callThrough();;

      service.focusToolbarButton('#test-toolbar', 'btn1', 0);
      service.focusToolbarButton('#test-toolbar', 'btn2', 10);
      service.focusToolbarButton('#test-toolbar', 'btn3', 20);

      tick(20);

      expect(focusSpy1).toHaveBeenCalledTimes(1);
      expect(focusSpy2).toHaveBeenCalledTimes(1);
      expect(focusSpy3).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(button3);
    }));
  });
}); 