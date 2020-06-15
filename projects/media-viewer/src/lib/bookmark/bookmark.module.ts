import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookmarkComponent } from './components/bookmark.component';
import { RouterModule } from '@angular/router';
import { BookmarkApiService } from './services/bookmark-api.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [
    BookmarkComponent,
  ],
  entryComponents: [
  ],
  providers: [
    BookmarkApiService
  ],
  exports: [
    BookmarkComponent
  ]
})
export class BookmarkModule { }
