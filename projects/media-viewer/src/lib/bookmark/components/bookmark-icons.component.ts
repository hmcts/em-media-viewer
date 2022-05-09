import {BookmarksPerPage, Bookmark} from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import {Component, Input, OnInit, SimpleChanges, OnChanges, ViewChild, ElementRef} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers/reducers';
import * as fromSelectors from '../../store/selectors/bookmark.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'mv-bookmark-icons',
  templateUrl: './bookmark-icons.component.html'
})
export class BookmarkIconsComponent implements OnInit, OnChanges {

  @Input() zoom: number;
  @Input() rotate: number;
  @Input() pageWidth: number;
  @Input() pageHeight: number;
  bookmarksPerPage$: Observable<BookmarksPerPage[]>;
  bookmarks: Bookmark[];
  documentId: string;

  @ViewChild('bookmark__here') viewRect: ElementRef;

  height: number;
  width: number;
  top: number;
  left: number;
  
  bMrk: Bookmark;
  @Input()
  set bookmarkIcon(bookmarkIcon: Bookmark) {
    this.bMrk = { ...bookmarkIcon };
    // this.height = bookmarkIcon.styles.height;
    // this.width = bookmarkIcon.styles.width;
    this.top = bookmarkIcon.yCoordinate;
    this.left = bookmarkIcon.xCoordinate;
  }

  get bookmarkIcon() {
    return this.bMrk;
  }

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit(): void {
    this.bookmarksPerPage$ = this.store.pipe(select(fromSelectors.getBookmarksPerPage));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.rotate) {
      this.rotateBookmarkIcon(this.rotate);
    }
  }

  rotateBookmarkIcon(rotation: number) {
    const { top, left, height, width } = this;
    switch (rotation) {
      case 90:
        console.log('bookmark rotated 90 degrees');
        console.log('left: ' + left + ' top: ' + top);
        // this.left = top;
        // this.top = left;
        break;
      // case 180:
      //   console.log('bookmark rotated 180 degrees');
      //   this.left = this.pageWidth - left - width;
      //   this.top = this.pageHeight - top - height;
      //   break;
      // case 270:
      //   console.log('bookmark rotated 270 degrees');
      //   this.width = height;
      //   this.height = width;
      //   this.left = top;
      //   this.top = this.pageHeight - left - width;
      //   break;
    }
  }

}
