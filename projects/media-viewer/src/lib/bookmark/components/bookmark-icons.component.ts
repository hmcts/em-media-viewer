import {Bookmark, BookmarksPerPage} from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import {Component, Input, OnInit} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers/reducers';
import * as fromSelectors from '../../store/selectors/bookmarks.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'mv-bookmark-icons',
  templateUrl: './bookmark-icons.component.html'
})
export class BookmarkIconsComponent implements OnInit {

  @Input() zoom: number;
  @Input() rotate: number;
  bookmarksPerPage$: Observable<BookmarksPerPage[]>;
  bookmarks: Bookmark[];
  documentId: string;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit(): void {
    this.bookmarksPerPage$ = this.store.pipe(select(fromSelectors.getBookmarksPerPage));
  }

}
