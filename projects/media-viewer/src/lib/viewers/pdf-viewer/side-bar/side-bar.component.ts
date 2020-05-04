import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy, OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Outline } from './outline-item/outline.model';
import { ViewerEventService } from '../../viewer-event.service';
import { ToolbarButtonVisibilityService } from '../../../toolbar/toolbar.module';
import { Observable, Subscription } from 'rxjs';
import { PdfJsWrapperFactory } from '../pdf-js/pdf-js-wrapper.provider';
import { select, Store } from '@ngrx/store';
import * as bookmarksSelectors from '../../../store/selectors/bookmarks.selectors';
import * as annoSelectors from '../../../store/selectors/annotations.selectors';
import * as fromAnnotations from '../../../store/reducers/annotatons.reducer';
import * as fromBookmarks from '../../../store/reducers/bookmarks.reducer';
import { Bookmark } from '../../../store/reducers/bookmarks.reducer';
import {CreateBookmark, LoadBookmarks, DeleteBookmark, UpdateBookmark} from '../../../store/actions/bookmarks.action';
import uuid from 'uuid';

@Component({
  selector: 'mv-side-bar',
  templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit, OnChanges, OnDestroy {

  @Input() outline: Outline;
  @Input() url: string;
  @Input() zoom: number;
  @Input() rotate: number;
  @Output() navigationEvent = new EventEmitter();

  selectedView = 'outline';
  bookmarks$: Observable<Bookmark[]>;
  BOOKMARK_CHAR_LIMIT = 30;

  height: number;
  width: number;
  editableBookmark: string;

  subscriptions: Subscription[];

  constructor(private viewerEvents: ViewerEventService,
              private toolbarButtons: ToolbarButtonVisibilityService,
              private pdfWrapperProvider: PdfJsWrapperFactory,
              private store: Store<fromBookmarks.BookmarksState>,
              private annotationsStore: Store<fromAnnotations.AnnotationSetState>,
  ) {
    this.subscriptions = [
      this.annotationsStore.select(annoSelectors.getAnnoPages)
        .subscribe(pages => {
          if (pages) {
            this.height = pages.styles.height;
            this.width = pages.styles.width;
          }
        }),
      this.store.pipe(select(bookmarksSelectors.getEditableBookmark))
        .subscribe(editableId => {
          this.editableBookmark = editableId;
          this.selectedView = editableId ? 'bookmark' : this.selectedView
        })
    ];
  }

  ngOnInit(): void {
    this.bookmarks$ = this.store.pipe(select(bookmarksSelectors.getAllBookmarks));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && this.url) {
      this.store.dispatch(new LoadBookmarks());
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  editBookmark(id) {
    this.editableBookmark = id;
  }

  resetEditBookmark() {
    this.editableBookmark = null;
  }

  goToBookmark(bookmark: Bookmark) {
    this.resetEditBookmark();
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
    this.goToDestination([
      bookmark.pageNumber,
      { 'name': 'XYZ' },
      0,
      bookmark.yCoordinate,
      this.zoom * 100
    ]);
  }

  deleteBookmark(bookmark: Bookmark) {
    this.resetEditBookmark();
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

  goToDestination(destination: any[]) {
    this.pdfWrapperProvider.pdfWrapper().navigateTo(destination);
  }

  toggleSidebarView(sidebarView: string) {
    this.selectedView = sidebarView;
  }

  onClick(sidebarView: string) {
    this.toggleSidebarView(sidebarView);
    this.resetEditBookmark();

    const pdfLocation: PdfLocation = this.pdfWrapperProvider.pdfWrapper().getLocation();
    this.store.dispatch(new CreateBookmark({
      name: 'new bookmark',
      pageNumber: pdfLocation.pageNumber - 1,
      xCoordinate: pdfLocation.left,
      yCoordinate: pdfLocation.top,
      id: uuid(),
      documentId: null
    }));
  }
}

interface PdfLocation {
  pageNumber: number;
  scale: number;
  top: number;
  left: number;
  rotation: number;
}
