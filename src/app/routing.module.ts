import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MediaViewerWrapperComponent } from './media-viewer-wrapper/media-viewer-wrapper.component';
import { MediaViewerModule } from '../../projects/media-viewer/src/media-viewer.module';
import { ToolbarModule } from '../../projects/media-viewer/src/toolbar/toolbar.module';
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
    MediaViewerModule,
    ToolbarModule,
    FormsModule
  ],
  exports: [RouterModule]
})

export class RoutingModule {
}
