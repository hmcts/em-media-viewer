import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Outline } from './outline-item/outline.model';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as bookmarksSelectors from '../../../store/selectors/bookmarks.selectors';
import { BookmarkNode } from '../../../store/model/bookmarks.interface';
import { CreateBookmark, LoadBookmarks } from '../../../store/actions/bookmarks.action';
import * as fromBookmarks from '../../../store/reducers/bookmarks.reducer';
import { take } from 'rxjs/operators';
import uuid from 'uuid';
import { ViewerEventService } from '../../viewer-event.service';
import { ToolbarButtonVisibilityService } from '../../../toolbar/toolbar.module';
import {PdfJsWrapperFactory} from '../pdf-js/pdf-js-wrapper.provider';

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
  bookmarkNodes$: Observable<BookmarkNode[]>;

  $subscription: Subscription;

  constructor(private viewerEvents: ViewerEventService,
              private toolbarButtons: ToolbarButtonVisibilityService,
              private store: Store<BookmarksState>,
              private pdfJsWrapper: PdfJsWrapperFactory
  ) {}

  ngOnInit(): void {
    this.bookmarkNodes$ = this.store.pipe(select(bookmarksSelectors.getBookmarkNodes));
    this.$subscription = this.store.pipe(select(bookmarksSelectors.getEditableBookmark))
      .subscribe(editable => this.selectedView = editable ? 'bookmarks' : this.selectedView);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && this.url) {
      this.store.dispatch(new LoadBookmarks());
    }
  }

  ngOnDestroy(): void {
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
    this.store.pipe(select(bookmarksSelectors.getBookmarkInfo), take(1))
      .subscribe((bookmarkInfo) => {
        // translate the bookmark coordinates using the viewportScale
        const scale = this.pdfJsWrapper.pdfWrapper().getViewportScale(bookmarkInfo.pageNumber);
        bookmarkInfo.yCoordinate *= scale;
        bookmarkInfo.yCoordinate = this.pdfJsWrapper.pdfWrapper().getPage(bookmarkInfo.pageNumber).height - bookmarkInfo.yCoordinate;
        this.store.dispatch(new CreateBookmark({
          ...bookmarkInfo, name: 'new bookmark', id: uuid()
        } as any));
      });
  }
}
