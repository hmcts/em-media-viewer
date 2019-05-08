import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerComponent } from './media-viewer/viewers/pdf-viewer/pdf-viewer.component';
import { PdfJsWrapper } from './media-viewer/viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { ImageViewerComponent } from './media-viewer/viewers/image-viewer/image-viewer.component';
import { UnsupportedViewerComponent } from './media-viewer/viewers/unsupported-viewer/unsupported-viewer.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { MediaViewerService } from './media-viewer/media-viewer.service';
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
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    MediaViewerComponent,
  ],
  entryComponents: [
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
],
  providers: [
    PdfJsWrapper,
    MediaViewerService,
    EmLoggerService,
    MediaViewerMessageService
  ],
  exports: [
    MediaViewerComponent
]
})
export class MediaViewerModule { }
