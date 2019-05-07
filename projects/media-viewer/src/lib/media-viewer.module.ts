import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from './media-viewer/annotation/comments/comments.component';
import { CommentItemComponent } from './media-viewer/annotation/comments/comment-item/comment-item.component';
import { PdfViewerComponent } from './media-viewer/viewers/pdf-viewer/pdf-viewer.component';
import { AnnotationApiHttpService } from './media-viewer/annotation/annotation-api-http.service';
import { ContextualToolbarComponent } from './media-viewer/viewers/pdf-viewer/contextual-toolbar/contextual-toolbar.component';
import { PdfJsWrapper } from './media-viewer/viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { ImageViewerComponent } from './media-viewer/viewers/image-viewer/image-viewer.component';
import { UnsupportedViewerComponent } from './media-viewer/viewers/unsupported-viewer/unsupported-viewer.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { MediaViewerService } from './media-viewer/media-viewer.service';
import { RotationComponent } from './media-viewer/viewers/pdf-viewer/rotation-toolbar/rotation.component';
import { EmLoggerService } from './logging/em-logger.service';
import {MediaViewerMessageService} from './media-viewer/service/media-viewer-message.service';

@NgModule({
  imports: [
    NgtUniversalModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    CommentsComponent,
    CommentItemComponent,
    ContextualToolbarComponent,
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    MediaViewerComponent,
    RotationComponent
  ],
  entryComponents: [
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    RotationComponent
],
  providers: [
    PdfJsWrapper,
    AnnotationApiHttpService,
    MediaViewerService,
    EmLoggerService,
    MediaViewerMessageService
  ],
  exports: [
    MediaViewerComponent
]
})
export class MediaViewerModule { }
