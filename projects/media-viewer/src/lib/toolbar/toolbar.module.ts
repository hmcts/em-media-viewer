 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SubToolbarComponent } from './sub-toolbar/sub-toolbar.component';
import { FormsModule } from '@angular/forms';
import { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
import { ToolbarEventService } from './toolbar-event.service';
import { RedactionToolbarComponent } from './redaction-toolbar/redaction-toolbar.component';
import { IcpToolbarComponent } from './icp-toolbar/icp-toolbar.component';
import { MediaViewerToolbarComponent } from './media-viewer-toolbar/media-viewer-toolbar.component';
export { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
export { ToolbarEventService } from './toolbar-event.service';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
  declarations: [
    SearchBarComponent,
    SubToolbarComponent,
    MainToolbarComponent,
    RedactionToolbarComponent,
    IcpToolbarComponent,
    MediaViewerToolbarComponent
  ],
  providers: [
    ToolbarButtonVisibilityService,
    ToolbarEventService
  ],
  exports: [
    MainToolbarComponent,
    SearchBarComponent,
    SubToolbarComponent,
    RedactionToolbarComponent,
    IcpToolbarComponent,
    MediaViewerToolbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule
  ]
})
export class ToolbarModule { }
