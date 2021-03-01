import {Component, Input} from '@angular/core';
/*
* Gov UK Date Component
* Responsible for displaying 3 input fields:
* day / month / year
* displaying errorMessage messages
* */
@Component({
  selector: 'mv-gov-uk-date',
templateUrl: './gov-uk-date.component.html'
})
export class GovUkDateComponent {
  @Input() config: { id: string; legend: string };
  @Input() errorMessage: {isInvalid: boolean; messages: string[]};
  @Input() formGroup;
}
