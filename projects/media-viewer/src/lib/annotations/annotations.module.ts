import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AnnotationApiService } from './annotation-api.service';
import { AnnotationViewComponent } from './annotation-set/annotation-view/annotation-view.component';
import { AnnotationSetComponent } from './annotation-set/annotation-set.component';
import { RectangleComponent } from './annotation-set/annotation-view/rectangle/rectangle.component';
import { CommentComponent } from './comment-set/comment/comment.component';
import { PopupToolbarComponent } from './annotation-set/annotation-view/popup-toolbar/popup-toolbar.component';
import { CommentSetComponent } from './comment-set/comment-set.component';
import { AnnotationEventService } from './annotation-event.service';
import { TextareaAutoExpandDirective } from './comment-set/comment/textarea-auto-expand.directive';
import { CommentSetToggleComponent } from './comment-set/comment-set-toggle/comment-set-toggle.component';
import { CommentsSummaryComponent } from './comments-summary/comments-summary.component';
import { CommentSetRenderService } from './comment-set/comment-set-render.service';
import { MutableDivModule } from 'mutable-div';
import { BoxHighlightCreateComponent } from './annotation-set/annotation-create/box-highlight-create.component';
import { BoxHighlightCreateService } from './annotation-set/annotation-create/box-highlight-create.service';
import { TextHighlightCreateService } from './annotation-set/annotation-create/text-highlight-create.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MutableDivModule
  ],
  declarations: [
    AnnotationViewComponent,
    BoxHighlightCreateComponent,
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
    AnnotationViewComponent,
    AnnotationSetComponent,
    CommentSetComponent
  ],
  providers: [
    AnnotationApiService,
    AnnotationEventService,
    CommentSetRenderService,
    BoxHighlightCreateService,
    TextHighlightCreateService
  ],
  exports: [
    AnnotationViewComponent,
    BoxHighlightCreateComponent,
    AnnotationSetComponent,
    CommentSetComponent,
    CommentSetToggleComponent,
    CommentsSummaryComponent
  ]
})
export class AnnotationsModule { }
