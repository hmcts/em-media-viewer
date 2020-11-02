import { Directive, ElementRef, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

// Strips any non-numerical text from a form input, leaving behind just a integer or nothing
//
// Usage: <input type="text" name="blah" appInteger />

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appInteger]'
})
export class IntegerInputDirective {

  constructor(
    @Self() private ngControl: NgControl, // A reference back to the input's ngControl on which this directive is placed.
    private el: ElementRef
  ) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const sanitisedValue: string = this.el.nativeElement.value.replace(/[^0-9]*/g, ''); // Remove any non-numerics
    this.ngControl.control.setValue(sanitisedValue);
  }
}
