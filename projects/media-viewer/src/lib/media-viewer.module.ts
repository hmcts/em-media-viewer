import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerComponent } from './media-viewer/viewers/pdf-viewer/pdf-viewer.component';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { ImageViewerComponent } from './media-viewer/viewers/image-viewer/image-viewer.component';
import { UnsupportedViewerComponent } from './media-viewer/viewers/unsupported-viewer/unsupported-viewer.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { MediaViewerService } from './media-viewer/service/media-viewer.service';
import { EmLoggerService } from './logging/em-logger.service';
import { ToolbarModule } from './media-viewer/toolbar/toolbar.module';
import { PdfJsWrapperFactory } from './media-viewer/viewers/pdf-viewer/pdf-js/pdf-js-wrapper.provider';
import {ErrorMessageComponent} from './media-viewer/viewers/error-message/error.message.component';

@NgModule({
  imports: [
    NgtUniversalModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ToolbarModule,
  ],
  declarations: [
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    MediaViewerComponent,
    ErrorMessageComponent
  ],
  entryComponents: [
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    ErrorMessageComponent
],
  providers: [
    PdfJsWrapperFactory,
    MediaViewerService,
    EmLoggerService
  ],
  exports: [
    MediaViewerComponent,
    ErrorMessageComponent
]
})
export class MediaViewerModule { }
