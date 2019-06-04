import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerComponent } from './media-viewer/viewers/pdf-viewer/pdf-viewer.component';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { ImageViewerComponent } from './media-viewer/viewers/image-viewer/image-viewer.component';
import { UnsupportedViewerComponent } from './media-viewer/viewers/unsupported-viewer/unsupported-viewer.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { ToolbarModule } from './media-viewer/toolbar/toolbar.module';
import { PdfJsWrapperFactory } from './media-viewer/viewers/pdf-viewer/pdf-js/pdf-js-wrapper.provider';
import { AnnotationsModule } from './media-viewer/annotations/annotations.module';

@NgModule({
  imports: [
    NgtUniversalModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ToolbarModule,
    AnnotationsModule
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
    PdfJsWrapperFactory
  ],
  exports: [
    MediaViewerComponent
]
})
export class MediaViewerModule { }
