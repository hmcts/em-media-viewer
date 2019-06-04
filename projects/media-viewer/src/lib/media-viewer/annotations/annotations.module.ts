import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { AnnotationApiService } from './annotation-api.service';

@NgModule({
  imports: [
    NgtUniversalModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  providers: [
    AnnotationApiService
  ],
  exports: [
  ]
})
export class AnnotationsModule { }
