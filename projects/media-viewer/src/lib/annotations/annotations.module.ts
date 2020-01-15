import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AnnotationApiService } from './annotation-api.service';
import { AnnotationComponent } from './annotation-set/annotation/annotation.component';
import { AnnotationSetComponent } from './annotation-set/annotation-set.component';
import { RectangleComponent } from './annotation-set/annotation/rectangle/rectangle.component';
import { CommentComponent } from './comment-set/comment/comment.component';
import { PopupToolbarComponent } from './annotation-set/annotation/popup-toolbar/popup-toolbar.component';
import { CommentSetComponent } from './comment-set/comment-set.component';
import { AnnotationService } from './annotation.service';
import { TextareaAutoExpandDirective } from './comment-set/comment/textarea-auto-expand.directive';
import { CommentSetToggleComponent } from './comment-set/comment-set-toggle/comment-set-toggle.component';
import { CommentsSummaryComponent } from './comments-summary/comments-summary.component';
import { CommentSetRenderService } from './comment-set/comment-set-render.service';
import { MutableDivModule } from 'mutable-div';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MutableDivModule
  ],
  declarations: [
    AnnotationComponent,
    AnnotationSetComponent,
    RectangleComponent,
    CommentComponent,
    PopupToolbarComponent,
    CommentSetComponent,
    TextareaAutoExpandDirective,
    CommentSetToggleComponent,
    CommentsSummaryComponent
  ],
  entryComponents: [
    AnnotationComponent,
    AnnotationSetComponent,
    CommentSetComponent
  ],
  providers: [
    AnnotationApiService,
    AnnotationService,
    CommentSetRenderService
  ],
  exports: [
    AnnotationComponent,
    AnnotationSetComponent,
    CommentSetComponent,
    CommentSetToggleComponent,
    CommentsSummaryComponent
  ]
})
export class AnnotationsModule { }
