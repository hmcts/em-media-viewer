import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { SearchBarComponent } from './main-toolbar/search-bar/search-bar.component';
import { SubToolbarComponent } from './main-toolbar/sub-toolbar/sub-toolbar.component';
import { ToolbarLeftPaneComponent } from './main-toolbar/left-pane/left-pane.component';
import { ToolbarRightPaneComponent } from './main-toolbar/right-pane/right-pane.component';
import { ToolbarMiddlePaneComponent } from './main-toolbar/middle-pane/middle-pane.component';
import { FormsModule } from '@angular/forms';
import { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
import { ToolbarEventService } from './toolbar-event.service';

export { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
export { ToolbarEventService } from './toolbar-event.service';



@NgModule({
  declarations: [
    SearchBarComponent,
    SubToolbarComponent,
    ToolbarLeftPaneComponent,
    ToolbarRightPaneComponent,
    MainToolbarComponent,
    ToolbarMiddlePaneComponent
  ],
  providers: [
    ToolbarButtonVisibilityService,
    ToolbarEventService
  ],
  exports: [
    MainToolbarComponent,
    SearchBarComponent,
    SubToolbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ToolbarModule { }
