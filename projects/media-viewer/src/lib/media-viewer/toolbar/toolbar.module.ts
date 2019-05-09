import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { SidebarComponent } from './sidebar.component';
import { FindbarComponent } from './findbar.component';
import { SecondaryToolbarComponent } from './secondary-toolbar.component';
import { ToolbarViewerLeftComponent } from './toolbar-viewer-left.component';
import { ToolbarViewerRightComponent } from './toolbar-viewer-right.component';
import { ToolbarViewerMiddleComponent } from './toolbar-viewer-middle.component';
import { ToolbarContextMenuComponent } from './toolbar-context-menu.component';

@NgModule({
  declarations: [
    FindbarComponent,
    SecondaryToolbarComponent,
    SidebarComponent,
    ToolbarViewerLeftComponent,
    ToolbarViewerRightComponent,
    ToolbarComponent,
    ToolbarViewerMiddleComponent,
    ToolbarContextMenuComponent
  ],
  exports: [
    ToolbarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ToolbarModule { }
