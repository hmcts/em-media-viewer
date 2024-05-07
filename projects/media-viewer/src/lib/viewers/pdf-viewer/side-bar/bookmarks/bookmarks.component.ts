import { Bookmark } from './../../../../store/models/bookmarks.interface';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TreeComponent, TreeNode } from '@circlon/angular-tree-component';

import { CreateBookmark, DeleteBookmark, MoveBookmark, UpdateBookmark } from '../../../../store/actions/bookmark.actions';
import * as bookmarksSelectors from '../../../../store/selectors/bookmark.selectors';
import { AnnotationSetState } from '../../../../store/reducers/annotations.reducer';
import { DocumentPages } from '../../../../store/reducers/document.reducer';
import * as fromDocument from '../../../../store/selectors/document.selectors';
import * as fromBookmarks from '../../../../store/reducers/bookmarks.reducer';
import { getBookmarkChildren } from '../../../../store/bookmarks-store-utils';
import { take } from 'rxjs/operators';
import uuid from 'uuid';
import { ArrayDataSource, SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'mv-bookmarks',
  templateUrl: './bookmarks.component.html'
})

//, OnChanges
export class BookmarksComponent implements OnInit, OnDestroy {

  @Input()
  set bookmarkNodes(value: Bookmark[]) {
    this.rebuildTreeForData(value);
    if (this._bookmarkNodes && this.sortMode !== this.customSort) {
      this.sortBookmarks();
    }
  };

  get bookmarkNodes() {
    return this._bookmarkNodes;
  };

  @Input() zoom: number;
  @Input() rotate: number;
  @Output() goToDestination = new EventEmitter<any[]>();

  // private _bookmarkNodes: Bookmark[] = [];
  private _bookmarkNodes: Bookmark[] = [];
  datasource: ArrayDataSource<Bookmark>;
  treeControl: FlatTreeControl<Bookmark>;
  // expansion model tracks expansion state
  expansionModel = new SelectionModel<Bookmark>(true);
  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  dragNodeInsertToParent: boolean;

  pageLookup: { [pageId: number]: DocumentPages } = {};
  editableBookmark: string;
  BOOKMARK_CHAR_LIMIT = 30;

  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: number;

  options = {
    allowDrag: true,
    allowDrop: true
  };

  $subscription: Subscription;

  @ViewChild(TreeComponent)
  tree: TreeComponent;

  private sortMode: string;

  private readonly _customSort = 'CUSTOM';
  private readonly _positionSort = 'POSITION';

  constructor(private store: Store<fromBookmarks.BookmarksState | AnnotationSetState>) { }

  ngOnInit(): void {
    this.sortMode = this.customSort;
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

  onAddBookmarkClick() {
    this.store.pipe(select(bookmarksSelectors.getBookmarkInfo), take(1))
      .subscribe((bookmarkInfo) => {
        this.store.dispatch(new CreateBookmark({
          ...bookmarkInfo, name: '', id: uuid()
        } as any));
      });
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
      movedBookmarks = [...movedBookmarks, { ...toNext, previous: node.id }];
    }
    console.log(JSON.stringify(movedBookmarks));
    this.store.dispatch(new MoveBookmark(movedBookmarks));
  }

  // deleteBookmark(node: TreeNode) {
  //   this.customSortBookmarks();
  //   let next: Bookmark;
  //   node = this.tree.treeModel.getNodeById(node.id);
  //   if (!node.parent) {
  //     node.parent = this.tree.treeModel.virtualRoot;
  //   }
  //   const siblings = node.parent.children;
  //   if (siblings.length > node.index + 1) {
  //     next = siblings[node.index + 1].data;
  //     next.previous = node.data.previous;
  //   }
  //   this.store.dispatch(new DeleteBookmark({
  //     deleted: [node.data.id, ...getBookmarkChildren(node.data.children)], updated: next
  //   }));
  // }

  deleteBookmark2(node: Bookmark) {
    this.customSortBookmarks();
    let next: Bookmark;
    const parent = this.getParent(this._bookmarkNodes, node.parent);

    const siblings = parent && parent.length > 0 ? parent[0].children : null;
    if (siblings && siblings.length > node.index + 1) {
      next = siblings[node.index + 1];
      next.previous = node.previous;
    }

    const toDelete = [node.id, ...getBookmarkChildren(node.children)];
    this.store.dispatch(new DeleteBookmark({
      deleted: toDelete, updated: next
    }));
  }

  updateBookmark(bookmark: Bookmark, name) {
    const editedBookmark = {
      ...bookmark,
      name
    };
    if (name) {
      this.store.dispatch(new UpdateBookmark(editedBookmark));
      this.editableBookmark = undefined;
    }
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

  get customSort() {
    return this._customSort;
  }

  get positionSort() {
    return this._positionSort;
  }

  sort(mode: string) {
    this.sortMode = mode;
    this.sortBookmarks();
  }

  private sortBookmarks() {
    switch (this.sortMode) {
      case this.customSort: {
        this.customSortBookmarks();
        break;
      }
      case this.positionSort: {
        this.positionSortBookmarks();
        break;
      }
      default: {
        this.customSortBookmarks();
        break;
      }
    }
  }

  private positionSortBookmarks() {
    this.bookmarkNodes.sort((a, b) => a.pageNumber === b.pageNumber ? a.yCoordinate - b.yCoordinate : a.pageNumber - b.pageNumber);
    this.setDragNDrop(false);
  }

  private customSortBookmarks() {
    this.bookmarkNodes.sort((a, b) => a.index - b.index);
    this.setDragNDrop(true);
  }

  private setDragNDrop(enabled: boolean) {
    this.options = {
      allowDrag: enabled,
      allowDrop: enabled
    };
  }


  private getSibling(node, index) {
    return node.parent.children.length > index ? node.parent.children[index] : undefined;
  }

  private scaledY(yCoordinate: number, height: number, page: DocumentPages): number {
    const viewportScale = page.viewportScale / this.zoom;
    return ((height / this.zoom) - yCoordinate) / viewportScale;
  }

  hasChild = (_: number, node: Bookmark) => {
    return node.children && node.children.length > 0;
  }

  getParent(bookmarks, parentId) {
    if (typeof bookmarks !== 'undefined') {
      for (let i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].id === parentId) {
          return [bookmarks[i]];
        }
        const a = this.getParent(bookmarks[i].children, parentId);
        if (a !== null) {
          a.unshift(bookmarks[i]);
          return a;
        }
      }
    }
    return null;
  }

  drop(event: CdkDragDrop<Bookmark>) {

    if (!event.isPointerOverContainer) return;

    const hasMovedUp = event.previousIndex > event.currentIndex;
    const changedData = JSON.parse(JSON.stringify(this.bookmarkNodes));
    const visibleNodes = this.visibleNodes(this._bookmarkNodes);
    const toNode = visibleNodes[event.currentIndex];
    const toNodeSiblings = this.findNodeSiblings(changedData, toNode.id);

    const toNodeParent = toNodeSiblings[0].parent;
    const toIndex = toNodeSiblings.findIndex(s => s.id === toNode.id);

    const fromNode = event.item.data;
    const fromNodeSiblings = this.findNodeSiblings(changedData, fromNode.id);
    const fromIndex = fromNodeSiblings.findIndex(n => n.id === fromNode.id);

    if (this.dragNodeInsertToParent) {

      const indexOfParent = toNodeSiblings.findIndex(element => element.id === toNode.id);
      const parentNode = toNodeSiblings[indexOfParent]
      let movedBookmarksWithParent = [{ ...fromNode, parent: parentNode.id, previous: null }];

      const parentMovedBookmarks = parentNode.previous === fromNode.id ? this.getSiblingFromAllSibliings(fromNodeSiblings, fromIndex - 1) : parentNode;

      movedBookmarksWithParent = [...movedBookmarksWithParent, { ...parentNode, previous: parentMovedBookmarks?.id }];

      this.store.dispatch(new MoveBookmark(movedBookmarksWithParent));
      return;
    }

    if (!toNodeSiblings) return;

    let movedBookmarks = [{
      ...fromNode,
      previous: toNode.index > 0 ? toNodeSiblings[toNode.index].id : undefined,
      parent: toNodeParent
    }];

    let fromNodeSibling = this.getSiblingFromAllSibliings(fromNodeSiblings, fromIndex + 1);
    fromNodeSibling = fromNodeSibling && fromNodeSibling.id === fromNode.previous ? this.getSiblingFromAllSibliings(fromNodeSiblings, fromIndex + 1) : fromNodeSibling;

    if (fromNodeSibling) {
      movedBookmarks = [...movedBookmarks, { ...fromNodeSibling, previous: fromNode.previous }];
    }


    const toNodeSiblingIndex = hasMovedUp ? toIndex : toIndex + 1;
    const toNodeSibling = this.getSiblingFromAllSibliings(toNodeSiblings, toNodeSiblingIndex);
    if (toNodeSibling) {
      movedBookmarks = [...movedBookmarks, { ...toNodeSibling, previous: fromNode.id }];
    }

    const hasDups = (movedBookmarks as Bookmark[]).map(x => x.id).some(function (value, index, array) {                            // .some will break as soon as duplicate found (no need to itterate over all array)
      return array.indexOf(value) !== array.lastIndexOf(value);   // comparing first and last indexes of the same value
    })
    if (hasDups || movedBookmarks && movedBookmarks.length <= 1) return;

    this.store.dispatch(new MoveBookmark(movedBookmarks));
  }

  private getSiblingFromAllSibliings(sibling: Bookmark[], index) {
    return sibling.length > index ? sibling[index] : undefined;
  }

  dragStart() {
    this.dragNodeInsertToParent = false;
    this.dragging = true;
  }

  dragEnd() {
    this.dragging = false;
  }

  dragHover(event: any, node: Bookmark) {
    if (this.dragging) {
      const newEvent: any = event;
      const percentageX = newEvent.offsetX / newEvent.target.clientWidth;

      if (percentageX > .25) {
        this.dragNodeInsertToParent = true;
      } else {
        this.dragNodeInsertToParent = false;
      }

      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.expandDelay);
    }
  }

  dragHoverEnd(event: any, node: Bookmark) {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
    }
  }

  onNodeExpand(node: Bookmark) {
    const isExpanded = this.treeControl.isExpanded(node);
    return isExpanded ? "toggle-children-wrapper-expanded" : "toggle-children-wrapper-collapsed";
  }

  visibleNodes(bookmarks: Bookmark[]): Bookmark[] {
    const result = [];

    function addExpandedChildren(node: Bookmark, expanded: Bookmark[]) {
      result.push(node);
      if (expanded.some(bookmark => bookmark && bookmark.id === node.id) && node.children) {
        node.children.map((child) => addExpandedChildren(child, expanded));
      }
    }
    bookmarks.forEach((node) => {
      addExpandedChildren(node, this.treeControl.expansionModel.selected);
    });
    return result;
  }

  findNodeSiblings(arr: Array<any>, id: string): Array<any> {
    let result, subResult;
    arr.forEach((item, i) => {
      if (item.id === id) {
        result = arr;
      } else if (item.children) {
        subResult = this.findNodeSiblings(item.children, id);
        if (subResult) result = subResult;
      }
    });
    return result;
  }

  rebuildTreeForData(data: any) {
    this._bookmarkNodes = data ?? [];
    this.datasource = new ArrayDataSource(this._bookmarkNodes);
    this.treeControl = new NestedTreeControl<Bookmark>(node => node.children);
    this.treeControl.dataNodes = this._bookmarkNodes;
    this.expansionModel.selected.forEach((bookmark) => {
      const node = this.treeControl.dataNodes.find((n) => n.id === bookmark.id);
      this.treeControl.expand(node);
    });
  }
}
