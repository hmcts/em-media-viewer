import { AfterContentChecked, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[textareaAutoGrow]'
})
export class TextareaAutoGrowDirective implements AfterContentChecked {

  constructor(private el: ElementRef) {
  }

  ngAfterContentChecked(): void {
    this.adjustHeight();
  }

  @HostListener('input') onMouseDown() {
    this.adjustHeight();
  }

  adjustHeight(): void {
    const nativeElement = this.el.nativeElement;
    nativeElement.style.overflow = 'hidden';
    nativeElement.style.height = 'auto';
    nativeElement.style.height = nativeElement.scrollHeight - 5 + 'px';
  }

}
