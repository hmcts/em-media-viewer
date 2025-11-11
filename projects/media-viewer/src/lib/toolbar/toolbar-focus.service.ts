import { Injectable } from '@angular/core';

@Injectable()
export class ToolbarFocusService {
  private lastFocusedButtonIds = new Map<string, string>();


  focusToolbarButton(toolbarSelector: string, buttonId?: string, delay = 0): void {
    setTimeout(() => {
      const element = document.querySelector(toolbarSelector);
      if (!element) {
        return;
      }

      if (buttonId) {
        const button = document.querySelector(`#${buttonId}`) as HTMLElement;
        if (button) {
          button.focus();
          return;
        }
      }

      if (element.tagName === 'BUTTON') {
        (element as HTMLElement).focus();
        return;
      }

      const tabbableButton = element.querySelector('button[tabindex="0"]') as HTMLElement;
      if (tabbableButton) {
        tabbableButton.focus();
      }
    }, delay);
  }

  trackFocusedButton(toolbarId: string, buttonId: string): void {
    this.lastFocusedButtonIds.set(toolbarId, buttonId);
  }

  getLastFocusedButton(toolbarId: string): string | undefined {
    return this.lastFocusedButtonIds.get(toolbarId);
  }
}