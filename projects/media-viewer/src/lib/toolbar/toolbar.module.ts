 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SubToolbarComponent } from './sub-toolbar/sub-toolbar.component';
import { ToolbarLeftPaneComponent } from './left-pane/left-pane.component';
import { ToolbarRightPaneComponent } from './right-pane/right-pane.component';
import { ToolbarMiddlePaneComponent } from './middle-pane/middle-pane.component';
import { FormsModule } from '@angular/forms';
import { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
import { ToolbarEventService } from './toolbar-event.service';
import { RedactionToolbarComponent } from './redaction-toolbar/redaction-toolbar.component';
 import { IcpToolbarComponent } from './icp-toolbar/icp-toolbar.component';

export { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
export { ToolbarEventService } from './toolbar-event.service';


@NgModule({
  declarations: [
    SearchBarComponent,
    SubToolbarComponent,
    ToolbarLeftPaneComponent,
    ToolbarRightPaneComponent,
    MainToolbarComponent,
    ToolbarMiddlePaneComponent,
    RedactionToolbarComponent,
    IcpToolbarComponent
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
    IcpToolbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ToolbarModule { }
