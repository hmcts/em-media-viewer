 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
import { ToolbarEventService } from './toolbar-event.service';
import { RedactionToolbarComponent } from './redaction-toolbar/redaction-toolbar.component';
import { IcpToolbarComponent } from './icp-toolbar/icp-toolbar.component';
export { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
export { ToolbarEventService } from './toolbar-event.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SearchBarComponent,
    MainToolbarComponent,
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
    RedactionToolbarComponent,
    IcpToolbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    RouterModule
  ]
})
export class ToolbarModule { }
