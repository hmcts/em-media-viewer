import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MediaViewerWrapperComponent } from './media-viewer-wrapper/media-viewer-wrapper.component';
import { MediaViewerModule } from '../../projects/media-viewer/src/lib/media-viewer.module';
import { ToolbarModule } from '../../projects/media-viewer/src/lib/toolbar/toolbar.module';
import { ToolbarTogglesComponent } from './media-viewer-wrapper/toolbar-toggles/toolbar-toggles.component';
import { CommentsSummaryModule } from '../../projects/media-viewer/src/lib/comments-summary/comments-summary.module';
import { ToggleComponent } from './media-viewer-wrapper/toolbar-toggles/toggle/toggle.component';
import { CustomToolbarModule } from './media-viewer-wrapper/custom-toolbar/custom-toolbar.module';

const routes: Routes = [{
    path: '',
    component: MediaViewerWrapperComponent
}];

@NgModule({
  declarations: [
    MediaViewerWrapperComponent,
    ToolbarTogglesComponent,
    ToggleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),
    HttpClientModule,
    ReactiveFormsModule,
    MediaViewerModule,
    ToolbarModule,
    FormsModule,
    CustomToolbarModule
  ],
  exports: [RouterModule]
})

export class RoutingModule {
}
