import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteBookmark, UpdateBookmark } from '../../../../store/actions/bookmarks.action';
import * as bookmarksSelectors from '../../../../store/selectors/bookmarks.selectors';
import { Subscription } from 'rxjs';
import * as fromDocument from '../../../../store/selectors/document.selectors';
import { AnnotationSetState } from '../../../../store/reducers/reducers';
import { Bookmark, BookmarksState } from './bookmarks.interfaces';

@Component({
  selector: 'mv-bookmarks',
  templateUrl: './bookmarks.component.html'
})
export class BookmarksComponent implements OnInit, OnDestroy {

  @Input() bookmarks: Bookmark[];
  @Input() zoom: number;
  @Input() rotate: number;
  @Output() goToDestination = new EventEmitter<any[]>();

  height: number;
  width: number;
  editableBookmark: string;
  BOOKMARK_CHAR_LIMIT = 30;

  options = {
    allowDrag: true,
    allowDrop: true
  }

  $subscription: Subscription;

  constructor(private store: Store<BookmarksState|AnnotationSetState>) {}

  ngOnInit(): void {
    this.$subscription = this.store.pipe(select(bookmarksSelectors.getEditableBookmark))
      .subscribe(editableId => this.editableBookmark = editableId);
    this.$subscription.add(this.store.select(fromDocument.getPages)
      .subscribe(pages => {
        if (pages[1]) {
          this.height = pages[1].styles.height;
          this.width = pages[1].styles.width;
        }
      }));
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  editBookmark(id) {
    this.editableBookmark = id;
  }

  goToBookmark(bookmark: Bookmark) {
    let top = 0, left = 0;
    switch (this.rotate) {
      case 90:
        left = - bookmark.yCoordinate;
        break;
      case 180:
        top = (this.height/this.zoom) - bookmark.yCoordinate;
        break;
      case 270:
        left = bookmark.yCoordinate;
        break;
      default:
        top = bookmark.yCoordinate;
    }
    this.goToDestination.emit([
      bookmark.pageNumber,
      { 'name': 'XYZ' },
      left,
      top
    ]);
  }

  deleteBookmark(bookmark: Bookmark) {
    this.store.dispatch(new DeleteBookmark(bookmark.id));
  }

  updateBookmark(bookmark: Bookmark, name) {
    const editedBookmark = {
      ... bookmark,
      name
    };
    this.store.dispatch(new UpdateBookmark(editedBookmark));
    this.editableBookmark = undefined;
  }
}
