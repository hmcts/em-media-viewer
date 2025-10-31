import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: '.mv-tooltip, [mvTooltipDismiss]'
})
export class TooltipDismissDirective {
  constructor(private el: ElementRef) {}

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeDismissTooltip() {
    const element = this.el.nativeElement as HTMLElement;
    element.setAttribute('data-tooltip-dismissed', 'true');
  }

  @HostListener('mouseenter')
  @HostListener('focus')
  @HostListener('focusin')
  onShowTooltip() {
    const element = this.el.nativeElement as HTMLElement;
    element.removeAttribute('data-tooltip-dismissed');
  }

}