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
import { CommentService } from './annotations/comment-set/comment/comment.service';
import { GrabNDragDirective } from './viewers/grab-n-drag.directive';
import { SideBarComponent } from './viewers/pdf-viewer/side-bar/side-bar.component';
import { OutlineItemComponent } from './viewers/pdf-viewer/side-bar/outline-item/outline-item.component';
import { TagInputModule } from 'ngx-chips';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule} from '@ngrx/store';
import {ReductionsComponent} from './reductions/components/reductions.component';
// APP store
import { reducers} from './store';
import { effects } from './store/effects/index';
import {ReductionApiService} from './reductions/services/reduction-api.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ToolbarModule,
    AnnotationsModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature('media-viewer', reducers),
    EffectsModule.forFeature(effects),
  ],
  declarations: [
    PdfViewerComponent,
    SideBarComponent,
    OutlineItemComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    MediaViewerComponent,
    GrabNDragDirective,
    ReductionsComponent // todo made put this into module
  ],
  entryComponents: [
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent
],
  providers: [
    PdfJsWrapperFactory,
    CommentService,
    ReductionApiService
  ],
  exports: [
    MediaViewerComponent
]
})
export class MediaViewerModule { }
