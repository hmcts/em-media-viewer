import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteBookmark, MoveBookmark, UpdateBookmark } from '../../../../store/actions/bookmarks.action';
import { Bookmark, BookmarkNode } from '../../../../store/model/bookmarks.interface';
import * as bookmarksSelectors from '../../../../store/selectors/bookmarks.selectors';
import { Subscription } from 'rxjs';
import { AnnotationSetState} from '../../../../store/reducers/annotations.reducer';
import { DocumentPages } from '../../../../store/reducers/document.reducer';
import * as fromDocument from '../../../../store/selectors/document.selectors';
import { TreeNode } from 'angular-tree-component';
import * as fromBookmarks from '../../../../store/reducers/bookmarks.reducer';
import { getBookmarkChildren } from '../../../../store/bookmarks-store-utils';

@Component({
  selector: 'mv-bookmarks',
  templateUrl: './bookmarks.component.html'
})
export class BookmarksComponent implements OnInit, OnDestroy {

  @Input() bookmarkNodes: BookmarkNode[];
  @Input() zoom: number;
  @Input() rotate: number;
  @Output() goToDestination = new EventEmitter<any[]>();

  pageLookup:  {[pageId: number]: DocumentPages } = {};
  editableBookmark: string;
  BOOKMARK_CHAR_LIMIT = 30;

  options = {
    allowDrag: true,
    allowDrop: true
  };

  $subscription: Subscription;

  constructor(private store: Store<fromBookmarks.BookmarksState|AnnotationSetState>) {}

  ngOnInit(): void {
    this.$subscription = this.store.pipe(select(bookmarksSelectors.getEditableBookmark))
      .subscribe(editableId => this.editableBookmark = editableId);
    this.$subscription.add(this.store.select(fromDocument.getPages)
      .subscribe(pages => {

        Object.keys(pages).map(key => {
          this.pageLookup[key] = pages[key];
        });

      }));
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  editBookmark(id) {
    this.editableBookmark = id;
  }

  onBookmarkMove({ node, from, to }: any) {
    let movedBookmarks = [{
      ...node,
      previous: to.index > 0 ? to.parent.children[to.index - 1].id : undefined,
      parent: to.parent.documentId ? to.parent.id : undefined
    }];
    let fromNext = this.getSibling(from, from.index);
    fromNext = fromNext && fromNext.id === node.previous ? this.getSibling(from, from.index + 1) : fromNext;
    if (fromNext) {
      movedBookmarks = [...movedBookmarks, { ...fromNext, previous: node.previous }];
    }
    const toNext = this.getSibling(to, to.index + 1);
    if (toNext) {
      movedBookmarks = [ ...movedBookmarks, { ...toNext, previous: node.id }];
    }
    this.store.dispatch(new MoveBookmark(movedBookmarks));
  }

  deleteBookmark(node: TreeNode) {
    let next: Bookmark;
    const siblings = node.parent.children;
    if (siblings.length > node.index + 1) {
      next = siblings[node.index + 1].data;
      next.previous = node.data.previous;
    }
    this.store.dispatch(new DeleteBookmark({
      deleted: [node.data.id, ...getBookmarkChildren(node.data.children)], updated: next
    }));
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

    const thisPage = this.pageLookup[bookmark.pageNumber + 1];
    const defaultHeight = thisPage.styles.height;
    const defaultScaleY = this.scaledY(bookmark.yCoordinate, defaultHeight, thisPage);

    let top = 0, left = 0;
    switch (this.rotate) {
      case 90:
        left = - defaultScaleY;
        break;
      case 180:
        top = this.scaledY(bookmark.yCoordinate, (defaultHeight - (24 * this.zoom)), thisPage);
        break;
      case 270:
        left = defaultScaleY;
        break;
      default:
        top = defaultScaleY;
    }

    this.goToDestination.emit([
      bookmark.pageNumber,
      { 'name': 'XYZ' },
      left,
      top
    ]);
  }

  private getSibling(node, index) {
    return node.parent.children.length > index ? node.parent.children[index] : undefined;
  }

  private scaledY(yCoordinate: number, height: number, page: DocumentPages): number {
    const viewportScale = page.viewportScale / this.zoom;
    return ((height / this.zoom) - yCoordinate) / viewportScale;
  }
}
