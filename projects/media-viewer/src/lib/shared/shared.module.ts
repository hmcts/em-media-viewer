import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GovUkDateComponent} from './gov-uk-date/gov-uk-date.component';
import {GovUkErrorMessageComponent} from './gov-uk-error-message/gov-uk-error-message.component';
import {GovUkFieldsetComponent} from './gov-uk-fieldset/gov-uk-fieldset.component';
import {GovUkLabelComponent} from './gov-uk-label/gov-uk-label.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule

  ],
  declarations: [
    GovUkDateComponent,
    GovUkErrorMessageComponent,
    GovUkFieldsetComponent,
    GovUkLabelComponent

  ],
  exports: [
    GovUkDateComponent,
    GovUkErrorMessageComponent,
    GovUkFieldsetComponent,
    GovUkLabelComponent
  ]
})
export class SharedModule {}
