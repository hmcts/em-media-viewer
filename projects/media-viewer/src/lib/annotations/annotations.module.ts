import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { AnnotationApiService } from './annotation-api.service';
import { AnnotationsComponent } from './annotations.component';
import { RectangleComponent } from './rectangle/rectangle.component';
import { CommentComponent } from './comment/comment.component';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  imports: [
    NgtUniversalModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AngularDraggableModule
  ],
  declarations: [
    AnnotationsComponent,
    RectangleComponent,
    CommentComponent
  ],
  entryComponents: [
  ],
  providers: [
    AnnotationApiService
  ],
  exports: [
    AnnotationsComponent,
    RectangleComponent,
    CommentComponent
  ]
})
export class AnnotationsModule { }
