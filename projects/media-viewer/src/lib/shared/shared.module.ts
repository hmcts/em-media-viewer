import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GovUkDateComponent} from './gov-uk-date/gov-uk-date.component';
import {GovUkErrorMessageComponent} from './gov-uk-error-message/gov-uk-error-message.component';
import {GovUkFieldsetComponent} from './gov-uk-fieldset/gov-uk-fieldset.component';
import {GovUkLabelComponent} from './gov-uk-label/gov-uk-label.component';



@NgModule({
  imports: [
    CommonModule,

  ],
  declarations: [
    GovUkDateComponent,
    GovUkErrorMessageComponent,
    GovUkFieldsetComponent,
    GovUkLabelComponent

  ],
  entryComponents: [

  ],
  providers: [

  ],
  exports: [
    GovUkDateComponent,
    GovUkErrorMessageComponent,
    GovUkFieldsetComponent,
    GovUkLabelComponent
  ]
})
export class SharedModule {}
