import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Outline } from './outline-item/outline.model';
import { ViewerEventService } from '../../viewer-event.service';
import { ToolbarButtonVisibilityService } from '../../../toolbar/toolbar.module';
import { Observable, Subscription } from 'rxjs';
import { PdfJsWrapperFactory } from '../pdf-js/pdf-js-wrapper.provider';
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
export class SideBarComponent implements OnInit, OnChanges {

  @Input() annotationsEnabled: boolean;
  @Input() outline: Outline;
  @Input() url: string;
  @Input() zoom: number;
  @Input() rotate: number;
  @Output() navigationEvent = new EventEmitter();

  selectedView = 'outline';
  bookmarks$: Observable<Bookmark[]>;

  subscriptions: Subscription[];

  constructor(private viewerEvents: ViewerEventService,
              private toolbarButtons: ToolbarButtonVisibilityService,
              private pdfWrapperProvider: PdfJsWrapperFactory,
              private store: Store<BookmarksState>
  ) {}

  ngOnInit(): void {
    this.bookmarks$ = this.store.pipe(select(bookmarksSelectors.getAllBookmarks));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && this.url) {
      this.store.dispatch(new LoadBookmarks());
    }
  }

  goToDestination(destination: any[]) {
    this.pdfWrapperProvider.pdfWrapper().navigateTo(destination);
  }

  toggleSidebarView(sidebarView: string) {
    this.selectedView = sidebarView;
  }

  onAddBookmarkClick() {
    this.toggleSidebarView('bookmark');
    this.store.pipe(select(fromBookmarks.getBookmarkInfo), take(1))
      .subscribe((bookmarkInfo) => {
        this.store.dispatch(new CreateBookmark({
          ...bookmarkInfo, name: 'new bookmark', id: uuid()
        }));
      });
  }
}
