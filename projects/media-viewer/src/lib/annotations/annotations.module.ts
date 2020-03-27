import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AnnotationApiService } from './annotation-api.service';
import { AnnotationViewComponent } from './annotation-set/annotation-view/annotation-view.component';
import { AnnotationSetComponent } from './annotation-set/annotation-set.component';
import { RectangleComponent } from './annotation-set/annotation-view/rectangle/rectangle.component';
import { CommentComponent } from './comment-set/comment/comment.component';
import { PopupToolbarComponent } from './annotation-set/annotation-view/popup-toolbar/popup-toolbar.component';
import { CommentSetComponent } from './comment-set/comment-set.component';
import { TextareaAutoExpandDirective } from './comment-set/comment/textarea-auto-expand.directive';
import { CommentSetToggleComponent } from './comment-set/comment-set-toggle/comment-set-toggle.component';
import { CommentsSummaryComponent } from './comments-summary/comments-summary.component';
import { CommentSetRenderService } from './comment-set/comment-set-render.service';
import { MutableDivModule } from 'mutable-div';
import { BoxHighlightCreateComponent } from './annotation-set/annotation-create/box-highlight-create.component';
import { BoxHighlightCreateService } from './annotation-set/annotation-create/box-highlight-create.service';
import { TextHighlightCreateService } from './annotation-set/annotation-create/text-highlight-create.service';
import { CommentSetHeaderComponent } from './comment-set/comment-set-header/comment-set-header.component';
import { CommentSearchComponent } from './comment-set/comment-set-header/comment-search/comment-search.component';
import { TextHighlightDirective } from './comment-set/comment/text-highlight.directive';
import { TagInputModule } from 'ngx-chips';
import { TagsComponent } from './tags/tags.component';
import { RouterModule } from '@angular/router';
import { TagsServices } from './services/tags/tags.services';
import { CommentsNavigateComponent } from './comment-set/comment-navigate/comments-navigate.component';
import {CommentFilterComponent} from './comment-set/comment-set-header/comment-filter/comment-filter.component';
import {MomentDatePipe} from './pipes/date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MutableDivModule,
    TagInputModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    AnnotationViewComponent,
    BoxHighlightCreateComponent,
    AnnotationSetComponent,
    RectangleComponent,
    CommentComponent,
    CommentSetHeaderComponent,
    CommentSearchComponent,
    TextHighlightDirective,
    PopupToolbarComponent,
    CommentSetComponent,
    CommentsNavigateComponent,
    TextareaAutoExpandDirective,
    CommentSetToggleComponent,
    CommentsSummaryComponent,
    TagsComponent,
    MomentDatePipe,
    CommentFilterComponent
  ],
  entryComponents: [
    AnnotationViewComponent,
    AnnotationSetComponent,
    CommentSetComponent
  ],
  providers: [
    AnnotationApiService,
    CommentSetRenderService,
    BoxHighlightCreateService,
    TextHighlightCreateService,
    TagsServices
  ],
  exports: [
    AnnotationViewComponent,
    BoxHighlightCreateComponent,
    AnnotationSetComponent,
    CommentSetComponent,
    CommentSetHeaderComponent,
    CommentSearchComponent,
    CommentSetToggleComponent,
    CommentsSummaryComponent,
    TagsComponent,
    CommentFilterComponent,
    MomentDatePipe
  ]
})
export class AnnotationsModule { }
