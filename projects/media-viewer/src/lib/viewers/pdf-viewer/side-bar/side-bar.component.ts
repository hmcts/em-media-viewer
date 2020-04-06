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
import { CreateBookmark, LoadBookmarks } from '../../../store/actions/bookmarks.action';
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

  height: number;
  width: number;

  subscriptions: Subscription[];

  constructor(private viewerEvents: ViewerEventService,
              private toolbarButtons: ToolbarButtonVisibilityService,
              private pdfWrapperProvider: PdfJsWrapperFactory,
              private bookmarksStore: Store<fromBookmarks.BookmarksState>,
              private annotationsStore: Store<fromAnnotations.AnnotationSetState>,
  ) {
    this.subscriptions = [
      viewerEvents.createBookmarkEvent.subscribe(bookmark => this.addBookmark(bookmark)),
      this.annotationsStore.select(annoSelectors.getAnnoPerPage)
        .subscribe(annotations => {
          if (annotations) {
            this.height = annotations[0].styles.height;
            this.width = annotations[0].styles.width;
          }
        })
    ];
  }

  ngOnInit(): void {
    this.bookmarks$ = this.bookmarksStore.pipe(select(bookmarksSelectors.getAllBookmarks));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && this.url) {
      this.bookmarksStore.dispatch(new LoadBookmarks(this.url));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  addBookmark(bookmark) {
    const documentId = this.extractDocumentId(this.url);
    const id = uuid();
    this.bookmarksStore.dispatch(new CreateBookmark({ ...bookmark, documentId, id }));
    this.toolbarButtons.sidebarOpen.next(true);
    this.selectedView = 'bookmark'
  }

  goToBookmark(bookmark: Bookmark) {
    let top;
    switch (this.rotate) {
      case 90:
        top = this.height/this.zoom - bookmark.xCoordinate;
        break;
      case 180:
        top = bookmark.yCoordinate;
        break;
      case 270:
        top = bookmark.xCoordinate;
        break;
      default:
        top = this.height/this.zoom - bookmark.yCoordinate;
    }
    this.goToDestination([
      bookmark.pageNumber,
      { 'name': 'XYZ' },
      0,
      top,
      this.zoom * 100
    ]);
  }

  goToDestination(destination: any[]) {
    this.pdfWrapperProvider.pdfWrapper().navigateTo(destination);
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
