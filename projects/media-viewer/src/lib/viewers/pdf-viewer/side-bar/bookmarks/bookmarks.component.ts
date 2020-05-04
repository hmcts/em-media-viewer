import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteBookmark, UpdateBookmark } from '../../../../store/actions/bookmarks.action';
import * as bookmarksSelectors from '../../../../store/selectors/bookmarks.selectors';
import { Subscription } from 'rxjs';
import * as annoSelectors from '../../../../store/selectors/annotations.selectors';
import { AnnotationSetState } from '../../../../store/reducers';
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
    this.$subscription.add(this.store.select(annoSelectors.getAnnoPages)
      .subscribe(pages => {
        if (pages) {
          this.height = pages.styles.height;
          this.width = pages.styles.width;
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
    let top;
    switch (this.rotate) {
      case 90:
        top = this.height / this.zoom - bookmark.xCoordinate;
        break;
      case 180:
        top = bookmark.yCoordinate;
        break;
      case 270:
        top = bookmark.xCoordinate;
        break;
      default:
        top = this.height / this.zoom - bookmark.yCoordinate;
    }
    this.goToDestination.emit([
      bookmark.pageNumber,
      { 'name': 'XYZ' },
      0,
      bookmark.yCoordinate,
      this.zoom * 100
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
