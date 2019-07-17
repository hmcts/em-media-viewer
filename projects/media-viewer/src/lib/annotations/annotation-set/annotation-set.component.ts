import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Annotation } from './annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { Rectangle } from './annotation/rectangle/rectangle.model';
import uuid from 'uuid';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { TextHighlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { Subscription } from 'rxjs';
import { PageRenderEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';

@Component({
  selector: 'mv-annotation-set',
  styleUrls: ['./annotation-set.component.scss'],
  templateUrl: './annotation-set.component.html'
})
export class AnnotationSetComponent implements OnInit, OnDestroy {

  @Input() annotationSet: AnnotationSet;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() width: number;
  @Input() height: number;
  @Input() page: number;

  @ViewChild('newRectangle') newRectangle: ElementRef;
  @ViewChild('container') container: ElementRef;

  selected = -1;
  drawStartX = -1;
  drawStartY = -1;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly api: AnnotationApiService,
    public readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService
  ) {}

  ngOnInit(): void {
    console.log('init annotation-set');
    this.subscriptions.push(this.viewerEvents.highlightedText.subscribe((highlight) => this.createRectangles(highlight)));
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions that we may have
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  initialise(eventSource: PageRenderEvent['source']) {
    this.zoom = eventSource.scale;
    this.rotate = eventSource.rotation;
    const element = eventSource.div;
    this.width = this.rotate % 180 === 0 ? element.clientWidth : element.clientHeight;
    this.height = this.rotate % 180 === 0 ? element.clientHeight : element.clientWidth;
    element.appendChild(this.container.nativeElement);
  }

  private createTextHighlightAnnotation(highlightPage: number, rectangle: Rectangle[]): void {
    console.log('page = ' + highlightPage);
    console.log('annotationSetPage = ' + this.page);
    if (highlightPage === this.page) {
      const annotation = {
        id: uuid(),
        annotationSetId: this.annotationSet.id,
        color: 'FFFF00',
        comments: [],
        page: this.page,
        rectangles: rectangle,
        type: 'highlight'
      };
      console.log('creating annotation');
      this.api.postAnnotation(annotation).subscribe(a => this.annotationSet.annotations.push(a));
    }
  }

  async createRectangles(textHighlight: TextHighlight) {
    if (window.getSelection) {
      const selection = window.getSelection();

      if (selection.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0).cloneRange();

        if (range.getClientRects) {
          const rectangles = range.getClientRects();
          const selectionRectangles: Rectangle[] = [];
          for (let i = 0; i < rectangles.length; i++) {
            const localElement = (<Element>textHighlight.event.target) || (<Element>textHighlight.event.srcElement);
            const textLayerRect = localElement.parentElement.getBoundingClientRect();

            const rect = rectangles[i];
            let width = (rect.right - rect.left) / this.zoom;
            let height = (rect.bottom - rect.top) / this.zoom;

            let localX = 0;
            let localY = 0;

            switch (this.rotate) {
              case 90:
                localX = (rect.top - textLayerRect.top) / this.zoom;
                localY = this.height - ((rect.left - textLayerRect.left + width) / this.zoom);
                width = (rect.bottom - rect.top) / this.zoom;
                height = (rect.right - rect.left) / this.zoom;
                break;
              case 180:
                localX = this.width - (rect.left - textLayerRect.left + width) / this.zoom;
                localY = this.height - (rect.top - textLayerRect.top + height) / this.zoom;
                break;
              case 270:
                localX = this.width - ((rect.top - textLayerRect.top + height) / this.zoom);
                localY = (rect.left - textLayerRect.left) / this.zoom;
                width = (rect.bottom - rect.top) / this.zoom;
                height = (rect.right - rect.left) / this.zoom;
                break;
              default:
                localX = (rect.left - textLayerRect.left) / this.zoom;
                localY = (rect.top - textLayerRect.top) / this.zoom;
            }

            selectionRectangles.push({id: uuid(), x: localX, y: localY, height: height, width: width} as Rectangle);
          }

          await this.createTextHighlightAnnotation(textHighlight.page, selectionRectangles);

          // Clear down the native selection
          const selectedText = window.getSelection();
          selectedText.removeAllRanges();
        }
      }
    }
  }

  public getAnnotationsOnPage(): Annotation[] {
    return this.annotationSet.annotations.filter(a => a.page === this.page);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.api
      .postAnnotation(annotation)
      .subscribe(newAnnotation => {
        const index = this.annotationSet.annotations.findIndex(a => a.id === newAnnotation.id);

        this.annotationSet.annotations[index] = newAnnotation;
        setTimeout(() => this.selected = index, 0);
      });
  }

  public onAnnotationDelete(annotation: Annotation) {
    this.api
      .deleteAnnotation(annotation.id)
      .subscribe(() => {
        this.annotationSet.annotations = this.annotationSet.annotations.filter(a => a.id !== annotation.id);
      });
  }

  public onAnnotationSelected(selected: boolean, i: number) {
    this.selected = selected ? i : -1;
  }

  public onMouseDown(event: MouseEvent) {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      this.createHighlight(event);
    }
  }

  public onMouseMove(event: MouseEvent) {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      this.updateHighlight(event);
    }
  }

  public onMouseUp() {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      const rectangle = {
        id: uuid(),
        x: +this.newRectStyle().left.slice(0, -2),
        y: +this.newRectStyle().top.slice(0, -2),
        width: +this.newRectStyle().width.slice(0, -2),
        height: +this.newRectStyle().height.slice(0, -2),
      };

      const annotation = {
        id: uuid(),
        annotationSetId: this.annotationSet.id,
        color: 'FFFF00',
        comments: [],
        page: 1,
        rectangles: [rectangle as Rectangle],
        type: 'highlight'
      };

      if (rectangle.height > 5 || rectangle.width > 5) {
        this.api
          .postAnnotation(annotation)
          .subscribe(a => this.annotationSet.annotations.push(a));

        this.toolbarEvents.drawMode.next(false);
      }
      this.resetHighlight();
    }
  }

  private createHighlight(event: MouseEvent) {
    this.drawStartX = event.pageX - (window.scrollX + this.containerRect().left);
    this.drawStartY = event.pageY - (window.scrollY + this.containerRect().top);

    this.newRectStyle().display = 'block';
    this.newRectStyle().top =  this.drawStartY + 'px';
    this.newRectStyle().left = this.drawStartX + 'px';
  }

  private updateHighlight(event: MouseEvent) {
    if (this.drawStartX > 0 && this.drawStartY > 0) {
      this.newRectStyle().height =
        (event.pageY - this.drawStartY - (window.scrollY + this.containerRect().top)) + 'px';
      this.newRectStyle().width =
        (event.pageX - this.drawStartX - (window.scrollX + this.containerRect().left)) + 'px';
    }
  }

  private resetHighlight() {
    this.drawStartX = -1;
    this.drawStartY = -1;
    this.newRectStyle().display = 'none';
    this.newRectStyle().width = '0';
    this.newRectStyle().height = '0';
  }

  private newRectStyle() {
    return this.newRectangle.nativeElement.style;
  }

  private containerRect() {
    return this.container.nativeElement.getBoundingClientRect();
  }


}
