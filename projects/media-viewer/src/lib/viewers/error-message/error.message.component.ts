import { Component, Input } from '@angular/core';

@Component({
  selector: 'mv-error-message',
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {

  @Input() errorMessage: string;

}
