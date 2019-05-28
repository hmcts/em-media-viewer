import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MediaViewerWrapperComponent } from './media-viewer-wrapper/media-viewer-wrapper.component';
import { MediaViewerModule } from '../../projects/media-viewer/src/lib/media-viewer.module';
import { ToolbarModule } from '../../projects/media-viewer/src/lib/media-viewer/toolbar/toolbar.module';
import { ToolbarTogglesComponent } from './media-viewer-wrapper/toolbar-toggles/toolbar-toggles.component';

const routes: Routes = [{
    path: '',
    component: MediaViewerWrapperComponent
}];

@NgModule({
  declarations: [
    MediaViewerWrapperComponent,
    ToolbarTogglesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MediaViewerModule,
    ToolbarModule
  ],
  exports: [RouterModule]
})

export class RoutingModule {
}
