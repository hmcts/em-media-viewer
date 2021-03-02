import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import uuid from 'uuid';

import * as fromStore from '../../../store/reducers/reducers';
import * as fromDocument from '../../../store/selectors/document.selectors';
import * as fromSelectors from '../../../store/selectors/annotation.selectors';
import { HighlightCreateService } from '../annotation-create/highlight-create/highlight-create.service';
import { Rectangle } from '../annotation-view/rectangle/rectangle.model';
import { CreateBookmark } from '../../../store/actions/bookmark.actions';
import * as fromBookmarks from '../../../store/selectors/bookmark.selectors';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { Highlight, ViewerEventService } from '../../../viewers/viewer-event.service';

@Component({
  selector: 'mv-metadata-layer',
  templateUrl: './metadata-layer.component.html'
})
export class MetadataLayerComponent implements OnInit, OnDestroy {

  @Input() zoom: number;
  @Input() rotate: number;

  pages: any[] = []; // todo add type
  annoPages$: Observable<any>; // todo add type

  drawMode = false;
  highlightPage: number;
  rectangles: Rectangle[];

  private $subscriptions: Subscription;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly highlightService: HighlightCreateService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService) {}

  ngOnInit(): void {
    this.$subscriptions = this.store.pipe(select(fromDocument.getPages))
      .subscribe(pages => this.pages = Object.values(pages));
    this.annoPages$ = this.store.pipe(select(fromSelectors.getPageEntities));

    this.$subscriptions
      .add(this.toolbarEvents.drawModeSubject.subscribe(drawMode => this.drawMode = drawMode))
      .add(this.viewerEvents.textHighlight.subscribe(highlight => this.showContextToolbar(highlight)))
      .add(this.viewerEvents.ctxToolbarCleared.subscribe(() => this.clearContextToolbar()));
  }

  ngOnDestroy(): void {
    this.$subscriptions.unsubscribe();
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

  saveAnnotation({ rectangles, page }: { rectangles: Rectangle[], page: any}) {
    this.highlightService.saveAnnotation(rectangles, page);
    this.toolbarEvents.drawModeSubject.next(false);
  }
}
