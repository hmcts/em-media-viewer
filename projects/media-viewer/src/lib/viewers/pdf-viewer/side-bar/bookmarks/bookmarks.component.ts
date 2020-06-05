import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteBookmark, MoveBookmark, UpdateBookmark } from '../../../../store/actions/bookmarks.action';
import { Bookmark, BookmarkNode, BookmarksState } from '../../../../store/model/bookmarks.interface';
import * as bookmarksSelectors from '../../../../store/selectors/bookmarks.selectors';
import { Subscription } from 'rxjs';
import * as annoSelectors from '../../../../store/selectors/annotations.selectors';
import { AnnotationSetState } from '../../../../store/reducers/annotatons.reducer';
import * as fromDocument from '../../../../store/selectors/document.selectors';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'mv-bookmarks',
  templateUrl: './bookmarks.component.html'
})
export class BookmarksComponent implements OnInit, OnDestroy {

  @Input() bookmarkNodes: BookmarkNode[];
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

  onBookmarkMove({ node, from, to }: any) {
    let fromNext = this.getChildNode(from, from.index);
    if (fromNext && fromNext.id === node.previous) {
      fromNext = this.getChildNode(from, from.index + 1);
    }
    this.store.dispatch(new MoveBookmark({
      node,
      from: {
        parent: from.parent.id,
        next: fromNext,
      },
      to: {
        parent: to.parent.id,
        previous: to.index > 0 ? to.parent.children[to.index - 1].id : undefined,
        next: this.getChildNode(to, to.index + 1),
      }
    }));
  }

  deleteBookmark(node: TreeNode) {
    let next: Bookmark;
    this.store.dispatch(new DeleteBookmark(node.data));
    const siblings = node.parent.children;
    if (siblings.length > node.index + 1) {
      next = siblings[node.index + 1].data;
      next.previous = node.data.previous;
      this.store.dispatch(new UpdateBookmark(next));
    }
  }

  updateBookmark(bookmark: Bookmark, name) {
    const editedBookmark = {
      ... bookmark,
      name
    };
    this.store.dispatch(new UpdateBookmark(editedBookmark));
    this.editableBookmark = undefined;
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

  private getChildNode(node, index) {
    return node.parent.children.length > index ? node.parent.children[index] : undefined
  }
}
