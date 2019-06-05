import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SubToolbarComponent } from './sub-toolbar/sub-toolbar.component';
import { ToolbarLeftPaneComponent } from './left-pane/left-pane.component';
import { ToolbarRightPaneComponent } from './right-pane/right-pane.component';
import { ToolbarMiddlePaneComponent } from './middle-pane/middle-pane.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SearchBarComponent,
    SubToolbarComponent,
    SideBarComponent,
    ToolbarLeftPaneComponent,
    ToolbarRightPaneComponent,
    MainToolbarComponent,
    ToolbarMiddlePaneComponent
  ],
  exports: [
    MainToolbarComponent,
    SearchBarComponent,
    SubToolbarComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ToolbarModule { }
