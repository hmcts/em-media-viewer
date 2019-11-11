import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomToolbarComponent } from './custom-toolbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CustomToolbarComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CustomToolbarComponent
  ]
})
export class CustomToolbarModule { }
