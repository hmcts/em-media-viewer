import { NgModule } from '@angular/core';
import { CommentsSummaryComponent } from './comments-summary.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CommentsSummaryComponent
  ],
  entryComponents: [
  ],
  providers: [
  ],
  exports: [
    CommentsSummaryComponent
  ]
})
export class CommentsSummaryModule { }
