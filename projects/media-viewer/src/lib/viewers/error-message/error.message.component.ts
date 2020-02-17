import { Component, Input } from '@angular/core';

@Component({
  selector: 'mv-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['../../../assets/sass/error-message.scss']
})
export class ErrorMessageComponent {

  @Input() errorMessage: string;

}
