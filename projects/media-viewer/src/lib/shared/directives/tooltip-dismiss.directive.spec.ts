import { ElementRef } from '@angular/core';
import { TooltipDismissDirective } from './tooltip-dismiss.directive';

describe('TooltipDismissDirective', () => {
  let directive: TooltipDismissDirective;
  let hostElement: HTMLElement;
  let elementRef: ElementRef<HTMLElement>;

  beforeEach(() => {
    hostElement = document.createElement('div');
    elementRef = new ElementRef<HTMLElement>(hostElement);
    directive = new TooltipDismissDirective(elementRef);
  });

  describe('onEscapeDismissTooltip', () => {
    it('should set data-tooltip-dismissed attribute to true on escape key', () => {
      expect(hostElement.hasAttribute('data-tooltip-dismissed')).toBe(false);

      directive.onEscapeDismissTooltip();

      expect(hostElement.getAttribute('data-tooltip-dismissed')).toBe('true');
    });

    it('should override existing data-tooltip-dismissed attribute on escape key', () => {
      hostElement.setAttribute('data-tooltip-dismissed', 'false');

      directive.onEscapeDismissTooltip();

      expect(hostElement.getAttribute('data-tooltip-dismissed')).toBe('true');
    });
  });

  describe('onShowTooltip', () => {
    it('should remove data-tooltip-dismissed attribute on mouseenter/focus/focusin', () => {
      hostElement.setAttribute('data-tooltip-dismissed', 'true');

      directive.onShowTooltip();

      expect(hostElement.hasAttribute('data-tooltip-dismissed')).toBe(false);
    });

    it('should not throw error when attribute does not exist', () => {
      expect(hostElement.hasAttribute('data-tooltip-dismissed')).toBe(false);

      expect(() => directive.onShowTooltip()).not.toThrow();
      expect(hostElement.hasAttribute('data-tooltip-dismissed')).toBe(false);
    });
  });

  describe('interaction flow', () => {
    it('should allow tooltip to be dismissed and then re-shown', () => {
      // dismiss tooltip with escape
      directive.onEscapeDismissTooltip();
      expect(hostElement.getAttribute('data-tooltip-dismissed')).toBe('true');

      // re-show tooltip on mouseenter
      directive.onShowTooltip();
      expect(hostElement.hasAttribute('data-tooltip-dismissed')).toBe(false);

      // dismiss again
      directive.onEscapeDismissTooltip();
      expect(hostElement.getAttribute('data-tooltip-dismissed')).toBe('true');
    });
  });
});