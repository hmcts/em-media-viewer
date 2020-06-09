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
import { RedactionComponent } from './redaction/components/redaction.component';
import { IcpSessionApiService } from './icp/icp-session-api.service';
import { IcpUpdateService } from './icp/icp-update.service';
import { SocketService } from './icp/socket.service';
// APP store
import { reducers} from './store/reducers/reducers';
import { effects } from './store/effects/index';
import { BookmarksComponent } from './viewers/pdf-viewer/side-bar/bookmarks/bookmarks.component';
import { RedactionApiService } from './redaction/services/redaction-api.service';
import { MutableDivModule } from 'mutable-div';
import { IcpDirective } from './icp/icp.directive';
import { IcpPresenterService } from './icp/icp-presenter.service';
import { IcpFollowerService } from './icp/icp-follower.service';
import { ConfirmActionDialogComponent } from './icp/confirm-exit/confirm-action-dialog.component';


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
    MutableDivModule
  ],
  declarations: [
    PdfViewerComponent,
    SideBarComponent,
    BookmarksComponent,
    OutlineItemComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent,
    MediaViewerComponent,
    GrabNDragDirective,
    IcpDirective,
    ConfirmActionDialogComponent,
    RedactionComponent // todo made put this into module
  ],
  entryComponents: [
    PdfViewerComponent,
    ImageViewerComponent,
    UnsupportedViewerComponent
  ],
  providers: [
    PdfJsWrapperFactory,
    CommentService,
    RedactionApiService,
    IcpSessionApiService,
    IcpUpdateService,
    SocketService,
    IcpPresenterService,
    IcpFollowerService
  ],
  exports: [
    MediaViewerComponent
  ]
})
export class MediaViewerModule { }
