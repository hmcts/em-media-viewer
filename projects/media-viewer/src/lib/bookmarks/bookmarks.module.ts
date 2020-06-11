import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookmarksComponent } from './components/bookmarks.component';
import { RouterModule } from '@angular/router';
import { BookmarksApiService } from './services/bookmarks-api.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [
    BookmarksComponent,
  ],
  entryComponents: [
  ],
  providers: [
    BookmarksApiService
  ],
  exports: [
    BookmarksComponent
  ]
})
export class BookmarksModule { }
