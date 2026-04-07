import { Injectable } from '@angular/core';

@Injectable()
export class ToolbarFocusService {
  focusToolbarButton(toolbarSelector: string, buttonId?: string, delay = 0): void {
    setTimeout(() => {
      const element = document.querySelector(toolbarSelector);
      if (!element) {
        return;
      }

      if (buttonId) {
        const button = document.querySelector(`#${buttonId}`) as HTMLElement;
        if (button) {
          this.focusWithoutScrolling(button);
          return;
        }
      }

      if (element.tagName === 'BUTTON') {
        this.focusWithoutScrolling(element as HTMLElement);
        return;
      }

      const tabbableButton = element.querySelector('button[tabindex="0"]') as HTMLElement;
      if (tabbableButton) {
        this.focusWithoutScrolling(tabbableButton);
      }
    }, delay);
  }

  private focusWithoutScrolling(element: HTMLElement): void {
    try {
      element.focus({ preventScroll: true });
    } catch {
      element.focus();
    }
  }
}
