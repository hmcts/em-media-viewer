import { Component, Input } from '@angular/core';

@Component({
  selector: 'mv-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {

  @Input() errorMessage: string;

}
