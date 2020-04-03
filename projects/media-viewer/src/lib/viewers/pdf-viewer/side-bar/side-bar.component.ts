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
import * as fromSelectors from '../../../store/selectors/bookmarks.selectors';
import * as fromStore from '../../../store/reducers/bookmarks.reducer';
import { Bookmark } from '../../../store/reducers/bookmarks.reducer';
import { CreateBookmark, LoadBookmarks } from '../../../store/actions/bookmarks.action';
import uuid from 'uuid';

@Component({
  selector: 'mv-side-bar',
  templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit, OnChanges, OnDestroy {

  @Input() outline: Outline;
  @Input() url: string;
  @Output() navigationEvent = new EventEmitter();

  selectedView = 'outline';
  bookmarks$: Observable<Bookmark[]>;

  subscription: Subscription;

  constructor(private viewerEvents: ViewerEventService,
              private toolbarButtons: ToolbarButtonVisibilityService,
              private pdfWrapperProvider: PdfJsWrapperFactory,
              private store: Store<fromStore.BookmarksState>,
  ) {
    this.subscription =
    viewerEvents.createBookmarkEvent.subscribe(bookmark => this.addBookmark(bookmark));
  }

  ngOnInit(): void {
    this.bookmarks$ = this.store.pipe(select(fromSelectors.getAllBookmarks));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && this.url) {
      console.log('dispatching the first call with this url: ', this.url)
      this.store.dispatch(new LoadBookmarks(this.url));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addBookmark(bookmark) {
    const documentId = this.extractDocumentId(this.url);
    const id = uuid();
    console.log('bookmark is: ', bookmark)
    this.store.dispatch(new CreateBookmark({ ...bookmark, documentId, id }));
    this.toolbarButtons.sidebarOpen.next(true);
    this.selectedView = 'bookmark'
  }

  goToDestination(bookmark: Bookmark) {
    console.log('destination is: ', bookmark)
    this.navigationEvent.emit([
      bookmark.pageNumber,
      { 'name': 'XYZ' },
      bookmark.xCoordinate,
      bookmark.yCoordinate
    ]);
  }

  toggleSidebarView(sidebarView: string) {
    this.selectedView = sidebarView;
  }

  onClick() {
    const pdfLocation: PdfLocation = this.pdfWrapperProvider.pdfWrapper().getLocation();
    this.addBookmark({
      name: 'new bookmark',
      pageNumber: pdfLocation.pageNumber - 1,
      xCoordinate: pdfLocation.left,
      yCoordinate: pdfLocation.top
    });
  }

  private extractDocumentId(url: string): string {
    url = url.includes('/documents/') ? url.split('/documents/')[1] : url;
    return url.replace('/binary', '');
  }
}

interface PdfLocation {
  pageNumber: number
  scale: number
  top: number
  left: number
  rotation: number
}
