import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Outline } from './outline-item/outline.model';
import { ViewerEventService } from '../../viewer-event.service';
import { ToolbarButtonVisibilityService } from '../../../toolbar/toolbar.module';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as bookmarksSelectors from '../../../store/selectors/bookmarks.selectors';
import { CreateBookmark, LoadBookmarks } from '../../../store/actions/bookmarks.action';
import { Bookmark, BookmarksState } from './bookmarks/bookmarks.interfaces';
import * as fromBookmarks from '../../../store/selectors/bookmarks.selectors';
import { take } from 'rxjs/operators';
import uuid from 'uuid';

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

  selectedView = 'outline';
  bookmarks$: Observable<Bookmark[]>;

  $subscription: Subscription;

  constructor(private viewerEvents: ViewerEventService,
              private toolbarButtons: ToolbarButtonVisibilityService,
              private store: Store<BookmarksState>
  ) {}

  ngOnInit(): void {
    this.bookmarks$ = this.store.pipe(select(bookmarksSelectors.getAllBookmarks));
    this.$subscription = this.store.pipe(select(bookmarksSelectors.getEditableBookmark))
      .subscribe(editable => this.selectedView = editable ? 'bookmarks' : this.selectedView);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && this.url) {
      this.store.dispatch(new LoadBookmarks());
    }
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  goToDestination(destination: any[]) {
    this.viewerEvents.goToDestination(destination);
  }

  toggleSidebarView(sidebarView: string) {
    this.selectedView = sidebarView;
  }

  onAddBookmarkClick() {
    this.toggleSidebarView('bookmarks');
    this.store.pipe(select(fromBookmarks.getBookmarkInfo), take(1))
      .subscribe((bookmarkInfo) => {
        this.store.dispatch(new CreateBookmark({
          ...bookmarkInfo, name: 'new bookmark', id: uuid()
        }));
      });
  }
}
