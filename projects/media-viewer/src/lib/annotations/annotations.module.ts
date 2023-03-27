import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { A11yModule } from '@angular/cdk/a11y';
import { RouterModule } from '@angular/router';

import { MutableDivModule } from 'mutable-div';
import { TagInputModule } from 'ngx-chips';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import { AnnotationApiService } from './services/annotation-api/annotation-api.service';
import { AnnotationViewComponent } from './annotation-set/annotation-view/annotation-view.component';
import { AnnotationSetComponent } from './annotation-set/annotation-set.component';
import { RectangleComponent } from './annotation-set/annotation-view/rectangle/rectangle.component';
import { CommentComponent } from './comment-set/comment/comment.component';
import { CtxToolbarComponent } from './annotation-set/ctx-toolbar/ctx-toolbar.component';
import { CommentSetComponent } from './comment-set/comment-set.component';
import { TextareaAutoExpandDirective } from './comment-set/comment/textarea-auto-expand/textarea-auto-expand.directive';
import { CommentsSummaryComponent } from './comments-summary/comments-summary.component';
import { CommentSetRenderService } from './comment-set/comment-set-render.service';
import { BoxHighlightCreateComponent } from './annotation-set/annotation-create/box-highlight-create/box-highlight-create.component';
import { HighlightCreateService } from './annotation-set/annotation-create/highlight-create/highlight-create.service';
import { CommentSetHeaderComponent } from './comment-set/comment-set-header/comment-set-header.component';
import { CommentSearchComponent } from './comment-set/comment-set-header/comment-search/comment-search.component';
import { TextHighlightDirective } from './comment-set/comment/text-highlight/text-highlight.directive';
import { TagsComponent } from './tags/tags.component';
import { TagsServices } from './services/tags/tags.services';
import { CommentsNavigateComponent } from './comment-set/comment-navigate/comments-navigate.component';
import {CommentFilterComponent} from './comment-set/comment-set-header/comment-filter/comment-filter.component';
import {MomentDatePipe} from './pipes/date/date.pipe';
import { BookmarksApiService } from './services/bookmarks-api/bookmarks-api.service';
import {FilterPipe} from './pipes/filter/filter.pipe';
import {UnsnakePipe} from './pipes/unsnake/unsnake.pipe';
import {SharedModule} from '../shared/shared.module';
import { MetadataLayerComponent } from './annotation-set/metadata-layer/metadata-layer.component';

@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MutableDivModule,
    TagInputModule,
    RouterModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SharedModule
  ],
  declarations: [
    MetadataLayerComponent,
    AnnotationViewComponent,
    BoxHighlightCreateComponent,
    AnnotationSetComponent,
    RectangleComponent,
    CommentComponent,
    CommentSetHeaderComponent,
    CommentSearchComponent,
    TextHighlightDirective,
    CtxToolbarComponent,
    CommentSetComponent,
    CommentsNavigateComponent,
    TextareaAutoExpandDirective,
    CommentsSummaryComponent,
    TagsComponent,
    MomentDatePipe,
    CommentFilterComponent,
    FilterPipe,
    UnsnakePipe
  ],
  entryComponents: [
    AnnotationViewComponent,
    AnnotationSetComponent,
    CommentSetComponent
  ],
  providers: [
    AnnotationApiService,
    BookmarksApiService,
    CommentSetRenderService,
    HighlightCreateService,
    TagsServices
  ],
  exports: [
    AnnotationViewComponent,
    BoxHighlightCreateComponent,
    AnnotationSetComponent,
    CommentSetComponent,
    CommentSetHeaderComponent,
    CommentSearchComponent,
    CommentsSummaryComponent,
    TagsComponent,
    CommentFilterComponent,
    MomentDatePipe,
    FilterPipe,
    UnsnakePipe,
    MetadataLayerComponent
  ]
})
export class AnnotationsModule { }
