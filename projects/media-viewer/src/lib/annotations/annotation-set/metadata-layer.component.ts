import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Highlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers/reducers';
import * as fromSelectors from '../../store/selectors/annotations.selectors';
import { HighlightCreateService } from './annotation-create/highlight-create.service';
import { Rectangle } from './annotation-view/rectangle/rectangle.model';
import { CreateBookmark } from '../../store/actions/bookmarks.action';
import * as fromBookmarks from '../../store/selectors/bookmarks.selectors';
import { take } from 'rxjs/operators';
import uuid from 'uuid';


@Component({
  selector: 'mv-metadata-layer',
  templateUrl: './metadata-layer.component.html'
})
export class MetadataLayerComponent implements OnInit, OnDestroy {

  annotationPages$: Observable<any[]>; // todo add type
  @Input() zoom: number;
  @Input() rotate: number;
  drawMode = false;
  highlightPage: number;
  rectangles: Rectangle[];

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly highlightService: HighlightCreateService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService) {}

  ngOnInit(): void {
    this.annotationPages$ = this.store.select(fromSelectors.getAnnoPerPage);
    this.subscriptions = [
      this.toolbarEvents.drawModeSubject
        .subscribe(drawMode => this.drawMode = drawMode),
      this.viewerEvents.textHighlight
        .subscribe(highlight => this.showContextToolbar(highlight)),
      this.viewerEvents.ctxToolbarCleared
        .subscribe(() => this.clearContextToolbar())
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  showContextToolbar(highlight: Highlight) {
    this.highlightPage = highlight.page;
    this.rectangles = highlight.rectangles;
    if (this.rectangles) {
      this.toolbarEvents.highlightModeSubject.next(false);
    }
  }

  clearContextToolbar() {
    this.rectangles = undefined;
  }

  createHighlight() {
    this.highlightService.saveAnnotation(this.rectangles, this.highlightPage);
    this.highlightService.resetHighlight();
    this.rectangles = undefined;
  }

  createBookmark(rectangle: Rectangle) {
    this.store.pipe(select(fromBookmarks.getBookmarkInfo), take(1))
      .subscribe((bookmarkInfo) => {
        const selection = window.getSelection().toString();
        this.store.dispatch(new CreateBookmark({
          ...bookmarkInfo,
          name: selection.length > 0 ? selection.substr(0, 30) : 'new bookmark',
          id: uuid(),
          pageNumber: this.highlightPage - 1,
          xCoordinate: rectangle.x,
          yCoordinate: rectangle.y
        } as any));
        this.toolbarEvents.toggleSideBar(true);
        this.highlightService.resetHighlight();
        this.rectangles = undefined;

      });
  }

  saveAnnotation({ rectangles, page }) {
    this.highlightService.saveAnnotation(rectangles, page);
    this.toolbarEvents.drawModeSubject.next(false);
  }
}
