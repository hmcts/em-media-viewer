import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { AnnotationApiService } from './annotation-api.service';
import { RectangleComponent } from './rectangle/rectangle.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  imports: [
    NgtUniversalModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    RectangleComponent,
    CommentComponent
  ],
  entryComponents: [
  ],
  providers: [
    AnnotationApiService
  ],
  exports: [
    CommentComponent
  ]
})
export class AnnotationsModule { }
