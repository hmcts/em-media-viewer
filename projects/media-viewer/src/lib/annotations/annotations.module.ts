import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { AnnotationApiService } from './annotation-api.service';
import { AnnotationComponent } from './annotation-set/annotation/annotation.component';
import { AnnotationSetComponent } from './annotation-set/annotation-set.component';
import { RectangleComponent } from './annotation-set/annotation/rectangle/rectangle.component';
import { CommentComponent } from './comment-set/comment/comment.component';
import { PopupToolbarComponent } from './annotation-set/annotation/popup-toolbar/popup-toolbar.component';
import { CommentSetComponent } from './comment-set/comment-set.component';
import { AnnotationService } from './annotation.service';

@NgModule({
  imports: [
    NgtUniversalModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    AnnotationComponent,
    AnnotationSetComponent,
    RectangleComponent,
    CommentComponent,
    PopupToolbarComponent,
    CommentSetComponent
  ],
  entryComponents: [
    AnnotationComponent,
    AnnotationSetComponent,
    CommentSetComponent
  ],
  providers: [
    AnnotationApiService,
    AnnotationService
  ],
  exports: [
    AnnotationComponent,
    AnnotationSetComponent,
    CommentSetComponent
  ]
})
export class AnnotationsModule { }
