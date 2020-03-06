import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerComponent } from './viewers/pdf-viewer/pdf-viewer.component';
import { ImageViewerComponent } from './viewers/image-viewer/image-viewer.component';
import { UnsupportedViewerComponent } from './viewers/unsupported-viewer/unsupported-viewer.component';
import { MediaViewerComponent } from './media-viewer.component';
import { ToolbarModule } from './toolbar/toolbar.module';
import { PdfJsWrapperFactory } from './viewers/pdf-viewer/pdf-js/pdf-js-wrapper.provider';
import { AnnotationsModule } from './annotations/annotations.module';
import { ErrorMessageComponent } from './viewers/error-message/error.message.component';
import { CommentService } from './annotations/comment-set/comment/comment.service';
import { GrabNDragDirective } from './viewers/grab-n-drag.directive';
import { OutlineViewComponent } from './viewers/pdf-viewer/outline-view/outline-view.component';
import { OutlineItemComponent } from './viewers/pdf-viewer/outline-view/outline-item/outline-item.component';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToolbarModule,
    AnnotationsModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    PdfViewerComponent,
    OutlineViewComponent,
    OutlineItemComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    MediaViewerComponent,
    ErrorMessageComponent,
    GrabNDragDirective
  ],
  entryComponents: [
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    ErrorMessageComponent
],
  providers: [
    PdfJsWrapperFactory,
    CommentService
  ],
  exports: [
    MediaViewerComponent
]
})
export class MediaViewerModule { }
