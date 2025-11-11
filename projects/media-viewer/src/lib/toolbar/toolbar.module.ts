import { RedactionSearchBarComponent } from './redaction-search-bar/redaction-search-bar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
import { RedactionToolbarComponent } from './redaction-toolbar/redaction-toolbar.component';
import { IcpToolbarComponent } from './icp-toolbar/icp-toolbar.component';
export { ToolbarButtonVisibilityService } from './toolbar-button-visibility.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { HighlightToolbarComponent } from './highlight-toolbar/highlight-toolbar.component';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { TooltipDismissDirective } from '../shared/directives/tooltip-dismiss.directive';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SearchBarComponent,
    MainToolbarComponent,
    RedactionToolbarComponent,
    IcpToolbarComponent,
    RedactionSearchBarComponent,
    HighlightToolbarComponent,
    TooltipDismissDirective
  ],
  providers: [
    ToolbarButtonVisibilityService
  ],
  exports: [
    MainToolbarComponent,
    SearchBarComponent,
    RedactionToolbarComponent,
    IcpToolbarComponent,
    RedactionSearchBarComponent,
    HighlightToolbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    RouterModule,
    RpxTranslationModule.forChild(),
    SharedModule
  ]
})
export class ToolbarModule { }
