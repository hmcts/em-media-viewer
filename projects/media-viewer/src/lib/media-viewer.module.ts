import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from './media-viewer/annotation/comments/comments.component';
import { CommentItemComponent } from './media-viewer/annotation/comments/comment-item/comment-item.component';
import { PdfAdapter } from './data/pdf-adapter';
import { NpaService } from './data/npa.service';
import { PdfService } from './data/pdf.service';
import { AnnotationStoreService } from './data/annotation-store.service';
import { PdfViewerComponent } from './media-viewer/viewers/pdf-viewer/pdf-viewer.component';
import { Utils } from './data/utils';
import { ApiHttpService } from './data/api-http.service';
import { ContextualToolbarComponent } from './media-viewer/viewers/pdf-viewer/contextual-toolbar/contextual-toolbar.component';
import { PdfAnnotateWrapper } from './data/js-wrapper/pdf-annotate-wrapper';
import { PdfWrapper } from './data/js-wrapper/pdf-wrapper';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { ImageViewerComponent } from './media-viewer/viewers/image-viewer/image-viewer.component';
import { UnsupportedViewerComponent } from './media-viewer/viewers/unsupported-viewer/unsupported-viewer.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { MediaViewerService } from './media-viewer/media-viewer.service';
import { RotationComponent } from './media-viewer/viewers/pdf-viewer/rotation-toolbar/rotation.component';
import { RotationFactoryService } from './media-viewer/viewers/pdf-viewer/rotation-toolbar/rotation-factory.service';
import { PdfRenderService } from './data/pdf-render.service';
import { EmLoggerService } from './logging/em-logger.service';

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
    PdfAnnotateWrapper,
    PdfWrapper,
    PdfService,
    AnnotationStoreService,
    PdfAdapter,
    NpaService,
    ApiHttpService,
    Utils,
    MediaViewerService,
    RotationFactoryService,
    PdfRenderService,
    EmLoggerService
  ],
  exports: [
    MediaViewerComponent
]
})
export class MediaViewerModule { }
