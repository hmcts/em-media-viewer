import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Outline } from './outline-item/outline.model';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as bookmarksSelectors from '../../../store/selectors/bookmark.selectors';
import { BookmarkNode } from '../../../store/models/bookmarks.interface';
import { CreateBookmark, LoadBookmarks } from '../../../store/actions/bookmark.actions';
import { take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ViewerEventService } from '../../viewer-event.service';
import { BookmarksState } from '../../../store/reducers/bookmarks.reducer';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { BookmarksComponent } from './bookmarks/bookmarks.component';

@Component({
  selector: 'mv-side-bar',
  templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit, OnChanges, OnDestroy {

  @Input() annotationsEnabled: boolean;
  @Input() outline: Outline;
  @Input() url: string;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() currentPageNumber: number;

  @ViewChild(BookmarksComponent)
  bookmarks: BookmarksComponent;

  selectedView = 'outline';
  bookmarkNodes$: Observable<BookmarkNode[]>;

  private subscriptions: Subscription[] = [];

  constructor(private viewerEvents: ViewerEventService,
    private store: Store<BookmarksState>,
    private readonly toolbarEvents: ToolbarEventService
  ) { }

  ngOnInit(): void {
    this.bookmarkNodes$ = this.store.pipe(select(bookmarksSelectors.getBookmarkNodes));
    this.subscriptions.push(this.store.pipe(select(bookmarksSelectors.getEditableBookmark))
      .subscribe(editable => this.selectedView = editable ? 'bookmarks' : this.selectedView));
    this.subscriptions.push(
      this.toolbarEvents.sidebarOutlineView.subscribe(toggle => {
        this.selectedView = toggle ? 'outline' : 'bookmarks';
      })
    );  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && this.url) {
      this.store.dispatch(new LoadBookmarks());
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  goToDestination(destination: any[]) {
    this.viewerEvents.goToDestination(destination);
  }

  toggleSidebarView(sidebarView: string) {
    this.selectedView = sidebarView;
  }

  isViewedItem(current: Outline, next: Outline): boolean {
    if (current.pageNumber === this.currentPageNumber) {
      return true;
    }
    return next === undefined ? current.pageNumber <= this.currentPageNumber :
      current.pageNumber <= this.currentPageNumber && (next.pageNumber > this.currentPageNumber);
  }

  findEndPage(next: Outline): number {
    return next === undefined ? Number.MAX_SAFE_INTEGER : next.pageNumber;
  }
}
